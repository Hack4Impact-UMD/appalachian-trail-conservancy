import { average } from "firebase/firestore";
import { PathwayID } from "../../types/PathwayType";
import { TrainingID } from "../../types/TrainingType";
import { VolunteerID } from "../../types/UserType";
import { VolunteerTraining, VolunteerPathway } from "../../types/UserType";
import { DateTime } from "luxon";

// Types for the data tables
export interface managementVolunteerType extends VolunteerID {
  numEnrolledTrainings: number;
  numCompletedTrainings: number;
  numEnrolledPathways: number;
  numCompletedPathways: number;
  mostRecentCompletion: string;
}

export interface managementTrainingType extends TrainingID {
  numCompletions: number;
  numInProgress: number;
  averageScore: number;
}

export interface managementPathwayType extends PathwayID {
  numCompletions: number;
  numInProgress: number;
  averageScore: number;
}

// Columns for the data table
export const usersColumns = [
  { field: "firstName", headerName: "First Name", width: 150 },
  { field: "lastName", headerName: "Last Name", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  {
    field: "numEnrolledTrainings",
    headerName: "Trainings Enrolled",
    width: 200,
  },
  {
    field: "numCompletedTrainings",
    headerName: "Trainings Completed",
    width: 200,
  },
  {
    field: "numEnrolledPathways",
    headerName: "Pathways Enrolled",
    width: 200,
  },
  {
    field: "numCompletedPathways",
    headerName: "Pathways Completed",
    width: 200,
  },
  {
    field: "mostRecentCompletion",
    headerName: "Most Recent Completion",
    width: 200,
  },
];

export const trainingsColumns = [
  {
    field: "name",
    headerName: "Training Name",
    width: 350,
  },
  {
    field: "numCompletions",
    headerName: "Completions",
    width: 200,
  },
  {
    field: "numInProgress",
    headerName: "In Progress",
    width: 200,
  },
  {
    field: "averageScore",
    headerName: "Average Score",
    width: 200,
  },
];

export const pathwaysColumns = [
  { field: "name", headerName: "Pathway Name", width: 350 },
  { field: "numCompletions", headerName: "Completions", width: 200 },
  { field: "numInProgress", headerName: "In Progress", width: 200 },
  { field: "averageScore", headerName: "Average Score", width: 200 },
];

function getMostRecentCompletion(
  volunteerTraining: VolunteerTraining[],
  volunteerPathway: VolunteerPathway[]
): string {
  if (volunteerTraining.length === 0 && volunteerPathway.length === 0) {
    return "N/A";
  }

  // Convert ISO date strings to milliseconds
  const trainingDates = volunteerTraining.map((training) =>
    DateTime.fromISO(training.dateCompleted).toMillis()
  );
  const pathwayDates = volunteerPathway.map((pathway) =>
    DateTime.fromISO(pathway.dateCompleted).toMillis()
  );

  // Find the most recent date
  const allDates = trainingDates.concat(pathwayDates);
  const mostRecentDate = allDates.reduce((a, b) => (a > b ? a : b), 0);
  return DateTime.fromMillis(mostRecentDate).toLocaleString();
}

// Convert VolunteerID[] to managementVolunteerType[] for data table
export function parseVolunteerData(
  volunteers: VolunteerID[]
): managementVolunteerType[] {
  return volunteers.map((volunteer) => {
    return {
      ...volunteer,
      numEnrolledTrainings: volunteer.trainingInformation.length,
      numCompletedTrainings: volunteer.trainingInformation.filter(
        (training) => training.progress === "COMPLETED"
      ).length,
      numEnrolledPathways: volunteer.pathwayInformation.length,
      numCompletedPathways: volunteer.pathwayInformation.filter(
        (pathway) => pathway.progress === "COMPLETED"
      ).length,
      mostRecentCompletion: getMostRecentCompletion(
        volunteer.trainingInformation,
        volunteer.pathwayInformation
      ),
    };
  });
}

// Convert TrainingID[] to managementTrainingType[] for data table
export function parseTrainingData(
  trainings: TrainingID[],
  volunteers: VolunteerID[]
): managementTrainingType[] {
  // Create a map of trainingID to training name
  const trainingMap = new Map<
    string,
    {
      numCompletions: number;
      numInProgress: number;
      averageScore: number;
    }
  >();

  trainings = trainings.filter((training) => training.status !== "DRAFT");

  // Initialize the map with 0 completions and 0 in progress
  trainings.forEach((training) => {
    trainingMap.set(training.id, {
      numCompletions: 0,
      numInProgress: 0,
      averageScore: 0,
    });
  });

  // Count the number of completions and in progress trainings
  volunteers.forEach((volunteer) => {
    volunteer.trainingInformation.forEach((training) => {
      const trainingData = trainingMap.get(training.trainingID);
      if (trainingData) {
        if (training.progress === "COMPLETED") {
          trainingData.numCompletions += 1;
        } else {
          trainingData.numInProgress += 1;
        }
      }
    });
  });

  // Calculate the average score for each training
  volunteers.forEach((volunteer) => {
    volunteer.trainingInformation.forEach((training) => {
      const trainingData = trainingMap.get(training.trainingID);
      if (trainingData && training.progress === "COMPLETED") {
        trainingData.averageScore =
          (trainingData.averageScore * (trainingData.numCompletions - 1) +
            (training.quizScoreRecieved ?? 0)) /
          trainingData.numCompletions;
      }
    });
  });

  const res: managementTrainingType[] = [];
  trainings.forEach((training) => {
    const trainingData = trainingMap.get(training.id);
    if (trainingData) {
      res.push({
        ...training,
        numCompletions: trainingData.numCompletions,
        numInProgress: trainingData.numInProgress,
        averageScore: trainingData.averageScore,
      });
    }
  });

  return res;
}

// Convert PathwayID[] to managementPathwayType[] for data table
export function parsePathwayData(
  pathways: PathwayID[],
  volunteers: VolunteerID[]
): managementPathwayType[] {
  // Create a map of pathwayID to pathway name
  const pathwayMap = new Map<
    string,
    {
      numCompletions: number;
      numInProgress: number;
      averageScore: number;
    }
  >();

  pathways = pathways.filter((pathway) => pathway.status !== "DRAFT");

  // Initialize the map with 0 completions and 0 in progress
  pathways.forEach((pathway) => {
    pathwayMap.set(pathway.id, {
      numCompletions: 0,
      numInProgress: 0,
      averageScore: 0,
    });
  });

  // Count the number of completions and in progress pathways
  volunteers.forEach((volunteer) => {
    volunteer.pathwayInformation.forEach((pathway) => {
      const pathwayData = pathwayMap.get(pathway.pathwayID);
      if (pathwayData) {
        if (pathway.progress === "COMPLETED") {
          pathwayData.numCompletions += 1;
        } else {
          pathwayData.numInProgress += 1;
        }
      }
    });
  });

  // Calculate the average score for each pathway
  volunteers.forEach((volunteer) => {
    volunteer.pathwayInformation.forEach((pathway) => {
      const pathwayData = pathwayMap.get(pathway.pathwayID);
      if (pathwayData && pathway.progress === "COMPLETED") {
        pathwayData.averageScore =
          (pathwayData.averageScore * (pathwayData.numCompletions - 1) +
            (pathway.quizScoreRecieved ?? 0)) /
          pathwayData.numCompletions;
      }
    });
  });

  const res: managementPathwayType[] = [];
  pathways.forEach((pathway) => {
    const pathwayData = pathwayMap.get(pathway.id);
    if (pathwayData) {
      res.push({
        ...pathway,
        numCompletions: pathwayData.numCompletions,
        numInProgress: pathwayData.numInProgress,
        averageScore: pathwayData.averageScore,
      });
    }
  });

  return res;
}

import { PathwayID } from "../../types/PathwayType";
import { TrainingID } from "../../types/TrainingType";
import { VolunteerID } from "../../types/UserType";
import { VolunteerTraining, VolunteerPathway } from "../../types/UserType";
import { exportTableToCSV } from "../../backend/AdminFirestoreCalls";
import { GridRowId, GridComparatorFn } from "@mui/x-data-grid";
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
  averageScore: number | string;
}

export interface managementPathwayType extends PathwayID {
  numCompletions: number;
  numInProgress: number;
  averageScore: number | string;
}

export const avgScoreComparator: GridComparatorFn<number> = (
  a: string | number,
  b: string | number
) => {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "number" && b == "N/A") {
    return 1;
  }
  if (typeof b === "number" && a == "N/A") {
    return -1;
  }
  return 0;
};

export const quizScoreComparator: GridComparatorFn<string> = (
  a: string,
  b: string
) => {
  if (a != "N/A" && b != "N/A") {
    const aSplit = a.split("/");
    const bSplit = b.split("/");
    const aScore = Number(aSplit[0]) / Number(aSplit[1]);
    const bScore = Number(bSplit[0]) / Number(bSplit[1]);
    const diff = aScore - bScore;
    if (diff !== 0) return diff;
    return aSplit[0] > bSplit[0] ? 1 : -1;
  }
  if (a != "N/A" && b == "N/A") {
    return 1;
  }
  if (b != "N/A" && a == "N/A") {
    return -1;
  }
  return 0;
};

export const passFailComparator: GridComparatorFn<string> = (
  a: string,
  b: string
) => {
  if (a != "N/A" && b != "N/A") {
    return a.localeCompare(b);
  }
  if (a != "N/A" && b == "N/A") {
    return 1;
  }
  if (b != "N/A" && a == "N/A") {
    return -1;
  }
  return 0;
};

// Columns for the data table
export const usersColumns = [
  { field: "firstName", headerName: "FIRST NAME", width: 150 },
  { field: "lastName", headerName: "LAST NAME", width: 150 },
  { field: "email", headerName: "EMAIL", width: 200 },
  {
    field: "numEnrolledTrainings",
    headerName: "TRAININGS ENROLLED",
    width: 200,
  },
  {
    field: "numCompletedTrainings",
    headerName: "TRAININGS COMPLETED",
    width: 200,
  },
  {
    field: "numEnrolledPathways",
    headerName: "PATHWAYS ENROLLED",
    width: 200,
  },
  {
    field: "numCompletedPathways",
    headerName: "PATHWAYS COMPLETED",
    width: 200,
  },
  {
    field: "mostRecentCompletion",
    headerName: "MOST RECENT COMPLETION",
    width: 200,
  },
];

export const trainingsColumns = [
  {
    field: "name",
    headerName: "TRAINING NAME",
    width: 350,
  },
  {
    field: "numCompletions",
    headerName: "COMPLETIONS",
    width: 200,
  },
  {
    field: "numInProgress",
    headerName: "IN PROGRESS",
    width: 200,
  },
  {
    field: "averageScore",
    headerName: "AVERAGE SCORE(%)",
    width: 200,
    sortComparator: avgScoreComparator,
  },
];

export const pathwaysColumns = [
  { field: "name", headerName: "PATHWAY NAME", width: 350 },
  { field: "numCompletions", headerName: "COMPLETIONS", width: 200 },
  { field: "numInProgress", headerName: "IN PROGRESS", width: 200 },
  {
    field: "averageScore",
    headerName: "AVERAGE SCORE(%)",
    width: 200,
    sortComparator: avgScoreComparator,
  },
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
  const allDates = trainingDates
    .concat(pathwayDates)
    .filter((date) => !isNaN(date));
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
    volunteer.trainingInformation.forEach((volunteerTraining) => {
      const trainingData = trainingMap.get(volunteerTraining.trainingID);
      if (trainingData) {
        if (volunteerTraining.progress === "COMPLETED") {
          trainingData.numCompletions += 1;
          trainingData.averageScore += volunteerTraining.quizScoreRecieved ?? 0;
        } else {
          trainingData.numInProgress += 1;
        }
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
        averageScore:
          trainingData.numCompletions === 0
            ? "N/A"
            : Number(
                (
                  (trainingData.averageScore /
                    (trainingData.numCompletions *
                      training.quiz.questions.length)) *
                  100
                ).toFixed(2)
              ),
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
    volunteer.pathwayInformation.forEach((volunteerPathway) => {
      const pathwayData = pathwayMap.get(volunteerPathway.pathwayID);
      if (pathwayData) {
        if (volunteerPathway.progress === "COMPLETED") {
          pathwayData.numCompletions += 1;
          pathwayData.averageScore += volunteerPathway.quizScoreRecieved ?? 0;
        } else {
          pathwayData.numInProgress += 1;
        }
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
        averageScore:
          pathwayData.numCompletions === 0
            ? "N/A"
            : Number(
                (
                  (pathwayData.averageScore /
                    (pathwayData.numCompletions *
                      pathway.quiz.questions.length)) *
                  100
                ).toFixed(2)
              ),
      });
    }
  });

  return res;
}

export function exportVolunteerData(
  selectedRows: GridRowId[],
  volunteerData: managementVolunteerType[]
): void {
  const header = usersColumns.map((column) => column.headerName);

  //Filter volunteer data based on selected rows
  const rowData = selectedRows.map((row) => {
    const volunteer = volunteerData.find((volunteer) => volunteer.id === row);
    if (volunteer) {
      return [
        volunteer.firstName,
        volunteer.lastName,
        volunteer.email,
        volunteer.numEnrolledTrainings,
        volunteer.numCompletedTrainings,
        volunteer.numEnrolledPathways,
        volunteer.numCompletedPathways,
        volunteer.mostRecentCompletion,
      ];
    }
  });

  exportTableToCSV([header, ...rowData]);
}

export function exportTrainingData(
  selectedRows: GridRowId[],
  trainings: managementTrainingType[]
): void {
  const header = trainingsColumns.map((column) => column.headerName);

  //Filter training data based on selected rows
  const rowData = selectedRows.map((row) => {
    const training = trainings.find((training) => training.id === row);
    if (training) {
      return [
        training.name,
        training.numCompletions,
        training.numInProgress,
        training.averageScore,
      ];
    }
  });

  exportTableToCSV([header, ...rowData]);
}

export function exportPathwayData(
  selectedRows: GridRowId[],
  pathwayData: managementPathwayType[]
): void {
  const header = pathwaysColumns.map((column) => column.headerName);

  //Filter pathway data based on selected rows
  const rowData = selectedRows.map((row) => {
    const pathway = pathwayData.find((pathway) => pathway.id === row);
    if (pathway) {
      return [
        pathway.name,
        pathway.numCompletions,
        pathway.numInProgress,
        pathway.averageScore,
      ];
    }
  });

  exportTableToCSV([header, ...rowData]);
}

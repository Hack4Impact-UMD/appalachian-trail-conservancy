export interface User {
  auth_id: string;
  id: string;
  email: string;
  type: Role;
}

export interface Volunteer extends User {
  auth_id: string;
  id: string;
  firstName: string;
  lastName: string;
  trainingInformation: VolunteerTraining[];
  pathwayInformation: PathwayTraining[];
}

export interface VolunteerTraining {
  trainingID: string;
  progress: Progress;
  numCompletedResources: number;
  numTotalResources: number;
  quizScoreRecieved: number;
}

export interface PathwayTraining {
  pathwayID: string;
  progress: Progress;
  trainingsCompleted: string[];
  numTrainingsCompleted: number;
  numTotalTrainings: number;
}

export interface Admin extends User {
  name: string;
}

// Should correspond with firestore & cloud functions
export type Role = "VOLUNTEER" | "ADMIN";

export type Progress = "INPROGRESS" | "COMPLETED";

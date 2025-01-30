export interface User {
  auth_id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: Role;
}

export interface Admin extends User {
  id: string;
}

export interface VolunteerID extends Volunteer {
  id: string;
}

export interface Volunteer extends User {
  trainingInformation: VolunteerTraining[];
  pathwayInformation: VolunteerPathway[];
}

export interface VolunteerTraining {
  trainingID: string;
  progress: Progress;
  dateCompleted: string; // ISO
  numCompletedResources: number;
  numTotalResources: number;
  quizScoreRecieved?: number;
}

export interface VolunteerPathway {
  pathwayID: string;
  progress: Progress;
  dateCompleted: string; // ISO
  trainingsCompleted: string[]; // training IDs
  trainingsInProgress: string[]; // training IDs
  numTrainingsCompleted: number;
  numTotalTrainings: number;
  quizScoreRecieved?: number;
}

// Should correspond with firestore & cloud functions
export type Role = "VOLUNTEER" | "ADMIN";

export type Progress = "INPROGRESS" | "COMPLETED";

export interface TrainingID extends Training {
  id: string;
}

export interface Training {
  name: string;
  description: string;
  coverImage: string;
  resources: TrainingResource[];
  quiz: string;
  associatedPathways: string[];
  certificationImage: string;
}

export interface TrainingResource {
  type: Resource;
  link: string;
  title: string;
}

export type Resource = "VIDEO" | "PDF";

export interface Quiz {
  id: string;
  trainingID: string;
  questions: Question[];
  numQuestions: number;
  passingScore: number;
}

export interface Question {
  question: string;
  choices: string[];
  answer: string;
}

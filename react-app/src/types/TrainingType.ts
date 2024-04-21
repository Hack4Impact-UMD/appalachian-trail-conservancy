export interface TrainingID extends Training {
  id: string;
}

export interface Training {
  name: string;
  description: string;
  coverImage: string; // URL
  resources: TrainingResource[];
  quizID: string;
  associatedPathways: string[]; // pathway IDs
  certificationImage: string; // URL
}

export interface TrainingResource {
  type: Resource;
  link: string; // URL
  title: string;
}

export type Resource = "VIDEO" | "PDF";

export interface QuizID extends Quiz {
  id: string;
}

export interface Quiz {
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

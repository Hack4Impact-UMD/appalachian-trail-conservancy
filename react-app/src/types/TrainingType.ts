export interface TrainingID extends Training {
  id: string;
}

export interface Training {
  name: string;
  shortBlurb: string;
  description: string;
  coverImage: string; // URL
  resources: TrainingResource[];
  quiz: Quiz;
  associatedPathways: string[]; // pathway IDs
  status: Status;
}

export type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface TrainingResource {
  type: Resource;
  link: string; // URL
  title: string;
}

export type Resource = "VIDEO" | "PDF";

export interface Quiz {
  questions: Question[];
  numQuestions: number;
  passingScore: number;
}

export interface Question {
  question: string;
  choices: string[];
  answer: string;
}

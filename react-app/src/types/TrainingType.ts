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
  certificationImage: string; // URL
}

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

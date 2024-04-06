export interface PathwayID extends Pathway {
  id: string;
}

export interface Pathway {
  name: string;
  description: string;
  coverImage: string;
  trainings: string[];
  badgeImage: string;
}

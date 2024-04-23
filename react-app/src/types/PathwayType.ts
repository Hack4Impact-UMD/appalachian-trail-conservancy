export interface PathwayID extends Pathway {
  id: string;
}

export interface Pathway {
  name: string;
  shortBlurb: string;
  description: string;
  coverImage: string; // URL
  trainingIDs: string[];
  badgeImage: string; // URL
}

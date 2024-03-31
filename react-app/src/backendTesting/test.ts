import { addTraining, addPathway } from "../backend/FirestoreCalls";
import { type Training } from "../types/TrainingType";
import { type Pathway } from "../types/PathwayType";

export const addSampleTraining = ({
  name = "Training",
  description = "desc",
  coverImage = "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
  resources = [],
  quiz = "",
  associatedPathways = [],
  certificationImage = "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
}) => {
  const training: Training = {
    name,
    description,
    coverImage,
    resources,
    quiz,
    associatedPathways,
    certificationImage,
  };
  addTraining(training)
    .then(() => {
      console.log("training added");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const addSamplePathway = ({
  name = "Pathway",
  description = "desc",
  coverImage = "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
  trainings = [],
  badgeImage = "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
}) => {
  const pathway: Pathway = {
    name,
    description,
    coverImage,
    trainings,
    badgeImage,
  };
  addPathway(pathway)
    .then(() => {
      console.log("pathway added");
    })
    .catch((error) => {
      console.log(error);
    });
};

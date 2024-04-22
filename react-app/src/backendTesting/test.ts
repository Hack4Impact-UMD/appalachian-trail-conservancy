import {
  addTraining,
  addPathway,
  getAllTrainings,
  getAllPathways,
} from "../backend/FirestoreCalls";
import { type Training, Resource } from "../types/TrainingType";
import { type Pathway } from "../types/PathwayType";

export const addSampleTraining = ({
  name = "Training",
  shortBlurb = "blurb",
  description = "desc",
  coverImage = "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
  resources = [
    {
      type: "VIDEO" as Resource,
      link: "https://youtu.be/GaIfI_IZFyA?si=q8g7CD1JaPrUDwVW",
      title: "A.T. Volunteer Intro and Safety",
    },
    {
      type: "VIDEO" as Resource,
      link: "https://youtu.be/C530WUqWYaU?si=FjsI34boKq2Dyoqd",
      title: "Blazing the Appalachian Trail",
    },
    {
      type: "PDF" as Resource,
      link: "https://bayes.wustl.edu/etj/articles/random.pdf",
      title: "Random Observations",
    },
    {
      type: "VIDEO" as Resource,
      link: "https://youtu.be/Z-iJeByrOHI?si=yTm0FCusOcQ8o_GK",
      title: "Planning for Appalachian Trail Maintenance",
    },
    {
      type: "PDF" as Resource,
      link: "https://philpapers.org/archive/DOROIO.pdf",
      title: "Being Rational and Being Wrong",
    },
  ],
  quiz = {
    questions: [
      {
        question: "What is the capital of France?",
        choices: ["London", "Paris", "Berlin"],
        answer: "Paris",
      },
      {
        question: "What is 2 + 2?",
        choices: ["3", "4", "5"],
        answer: "4",
      },
    ],
    numQuestions: 2,
    passingScore: 1,
  },
  associatedPathways = [],
  certificationImage = "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
}) => {
  const training: Training = {
    name,
    shortBlurb,
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
  trainingIDs = [],
  badgeImage = "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
}) => {
  const pathway: Pathway = {
    name,
    description,
    coverImage,
    trainingIDs,
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

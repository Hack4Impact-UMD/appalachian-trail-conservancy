import {
  addTraining,
  addPathway,
  addQuiz,
  getAllTrainings,
  getAllPathways,
} from "../backend/FirestoreCalls";
import { type Training, TrainingID, Quiz } from "../types/TrainingType";
import { type Pathway } from "../types/PathwayType";

export const addSampleTraining = ({
  name = "Training",
  description = "desc",
  coverImage = "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
  resources = [],
  quizID = "",
  associatedPathways = [],
  certificationImage = "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
}) => {
  const training: Training = {
    name,
    description,
    coverImage,
    resources,
    quizID,
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

export const addSampleQuiz = ({
  id = "id",
  trainingID = "trainingId",
  questions = [
    {
      question: "What is the capital of France?",
      choices: ["London", "Paris", "Berlin"],
      answer: "Paris"
    },
    {
      question: "What is 2 + 2?",
      choices: ["3", "4", "5"],
      answer: "4"
    }
  ],
  numQuestions = 2,
  passingScore = 1,
}) => {
  const quiz: Quiz = {
    id,
    trainingID,
    questions,
    numQuestions,
    passingScore,
  };
  addQuiz(quiz)
    .then(() => {
      console.log("quiz added");
    })
    .catch((error) => {
      console.log(error);
    })
};

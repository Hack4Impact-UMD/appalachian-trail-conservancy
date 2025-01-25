import {
  addTraining,
  addPathway,
  getAllTrainings,
  getAllPathways,
  updatePathway,
  addVolunteerTraining,
  addVolunteerPathway,
} from "../backend/FirestoreCalls";
import { type Training, Resource, Status } from "../types/TrainingType";
import { type Pathway } from "../types/PathwayType";
import { type User } from "../types/UserType";

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
  status = "DRAFT" as Status,
}) => {
  const training: Training = {
    name,
    shortBlurb,
    description,
    coverImage,
    resources,
    quiz,
    associatedPathways,
    status,
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
  shortBlurb = "blurb",
  description = "desc",
  coverImage = "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
  trainingIDs = [],
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
  status = "DRAFT" as Status,
}) => {
  const pathway: Pathway = {
    name,
    shortBlurb,
    description,
    coverImage,
    trainingIDs,
    quiz,
    status,
  };
  addPathway(pathway)
    .then(() => {
      console.log("pathway added");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const addSampleVolunteerTraining = () => {
  addVolunteerTraining("ZpfkIPPdBuaeA6iFyhaR", {
    id: "test",
    name: "Training",
    shortBlurb: "blurb",
    description: "desc",
    coverImage:
      "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
    resources: [
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
    quiz: {
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
    associatedPathways: [],
    status: "DRAFT" as Status,
  })
    .then(() => {
      console.log("Volunteer training added successfully.");
    })
    .catch((error) => {
      console.error("Error adding volunteer training:", error);
    });
};

// export const addSampleVolunteerPathway = () => {
//   addVolunteerPathway("ZpfkIPPdBuaeA6iFyhaR", {
//     name: "Pathway",
//     description: "desc",
//     shortBlurb: "shortBlurb",
//     coverImage:
//       "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
//     trainingIDs: ["test1", "test2", "test3"],
//     quiz: {
//       questions: [
//         {
//           question: "What is the capital of France?",
//           choices: ["London", "Paris", "Berlin"],
//           answer: "Paris",
//         },
//         {
//           question: "What is 2 + 2?",
//           choices: ["3", "4", "5"],
//           answer: "4",
//         },
//       ],
//       numQuestions: 2,
//       passingScore: 1,
//     },
//     status: "DRAFT" as Status,
//   })
//     .then(() => {
//       console.log("Volunteer pathway added successfully.");
//     })
//     .catch((error) => {
//       console.error("Error adding volunteer pathway:", error);
//     });
// };

export const updateSamplePathway = () => {
  updatePathway(
    {
      name: "Organizational Leadership Best Practices",
      description:
        "This self-paced online training includes a guide for planning and running effective meetings. From planning and preparation, tools for effectively conducting the meetings, and providing closure and follow-up, this course is a helpful tool for A.T.-maintaining clubs and Communities. This training is distributed as a resource booklet.",
      shortBlurb:
        "Intended for A.T. Club leaders, this webinar covers best practices of organizational leadership to benefit their organization. Self-paced online training in five chapters, total running time 1 hour 5 minutes.",
      coverImage:
        "https://media.newyorker.com/photos/5c0195240591e72cf6b59d12/1:1/w_1465,h_1465,c_limit/Duke-Spongebob_01.jpg",
      trainingIDs: [
        "lmLRWvZqwPdtarb6UDXX",
        "wJ3Nh6Jjqz3EA0qQ8aNy",
        "hv8UZJU8VIy8HB9NsajS",
      ],
      quiz: {
        questions: [
          {
            question: "What is the best leadership practice?",
            choices: [
              "Kicking people",
              "Listening to others",
              "Having patience",
            ],
            answer: "Having patience",
          },
          {
            question: "How can an effective meeting be organized?",
            choices: [
              "Asking someone else to plan it for you",
              "Using Notion to have a team plan it for you",
              "Hoping everything works out",
            ],
            answer: "Hoping everything works out",
          },
        ],
        numQuestions: 2,
        passingScore: 2,
      },
      status: "DRAFT" as Status,
    },
    "R8inCysiACE7bk1zy3y8"
  )
    .then(() => {
      console.log("Pathway updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating pathway:", error);
    });
};

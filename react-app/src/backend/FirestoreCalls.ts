import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  updateDoc,
  runTransaction,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Volunteer, VolunteerID } from "../types/UserType";
import { Training, TrainingID, Quiz } from "../types/TrainingType";
import { Pathway, PathwayID } from "../types/PathwayType";

/* These can be edited depending on collection name and types */

export function getVolunteerWithAuth(auth_id: string): Promise<VolunteerID> {
  return new Promise((resolve, reject) => {
    const volunteersRef = query(
      collection(db, "Users"),
      where("auth_id", "==", auth_id)
    );
    getDocs(volunteersRef)
      .then((volunteerSnapshot) => {
        if (volunteerSnapshot.size > 0) {
          const volunteerData = volunteerSnapshot.docs[0].data() as Volunteer;
          resolve({ ...volunteerData, id: volunteerSnapshot.docs[0].id });
        } else {
          reject(new Error("Volunteer does not exist"));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function addTraining(training: Training): Promise<string> {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, "Trainings"), training)
      .then((docRef) => {
        resolve(docRef.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getTraining(id: string): Promise<TrainingID> {
  return new Promise((resolve, reject) => {
    getDoc(doc(db, "Trainings", id))
      .then((trainingSnapshot) => {
        if (trainingSnapshot.exists()) {
          const training: Training = trainingSnapshot.data() as Training;
          resolve({ ...training, id });
        } else {
          reject(new Error("Training does not exist"));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function addQuiz(quiz: Quiz): Promise<string> {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, "Quizzes"), quiz)
      .then((docRef) => {
        resolve(docRef.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getQuiz(id: string): Promise<Quiz> {
  return new Promise((resolve, reject) => {
    getDoc(doc(db, "Quizzes", id))
      .then((quizSnapshot) => {
        if (quizSnapshot.exists()) {
          const quiz: Quiz = quizSnapshot.data() as Quiz;
          resolve({ ...quiz, id});
        } else {
          reject(new Error("Quiz does not exist"));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function addPathway(pathway: Pathway): Promise<string> {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, "Pathways"), pathway)
      .then((docRef) => {
        resolve(docRef.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getPathway(id: string): Promise<PathwayID> {
  return new Promise((resolve, reject) => {
    getDoc(doc(db, "Pathways", id))
      .then((pathwaySnapshot) => {
        if (pathwaySnapshot.exists()) {
          const pathway: Pathway = pathwaySnapshot.data() as Pathway;
          resolve({ ...pathway, id });
        } else {
          reject(new Error("Pathway does not exist"));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getAllTrainings(): Promise<TrainingID[]> {
  const trainingsRef = collection(db, 'Trainings');
  return new Promise((resolve, reject) => {
    getDocs(trainingsRef)
      .then((trainingSnapshot) => {
        const allTrainings: TrainingID[] = [];
        const trainings = trainingSnapshot.docs.map((doc) => {
          const training: Training = doc.data() as Training;
          const newTraining: TrainingID = { ...training, id: doc.id };
          allTrainings.push(newTraining);
        });
        resolve( allTrainings );
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getAllPathways(): Promise<PathwayID[]> {
  const pathwaysRef = collection(db, 'Pathways');
  return new Promise((resolve, reject) => {
    getDocs(pathwaysRef)
      .then((pathwaySnapshot) => {
        const allPathways: PathwayID[] = [];
        const pathways = pathwaySnapshot.docs.map((doc) => {
          const pathway: Pathway = doc.data() as Pathway;
          const newPathway: PathwayID = { ...pathway, id: doc.id };
          allPathways.push(newPathway);
        });
        resolve( allPathways );
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getAllQuizzes(): Promise<Quiz[]> {
  const quizzesRef = collection(db, 'Quizzes');
  return new Promise((resolve, reject) => {
    getDocs(quizzesRef)
      .then((quizSnapshot) => {
        const allQuizzes: Quiz[] = [];
        const quizzes = quizSnapshot.docs.map((doc) => {
          const quiz: Quiz = doc.data() as Quiz;
          const newQuiz: Quiz = { ...quiz, id: doc.id };
          allQuizzes.push(newQuiz);
        });
        resolve( allQuizzes );
      })
      .catch((e) => {
        reject(e);
      });
  });
}
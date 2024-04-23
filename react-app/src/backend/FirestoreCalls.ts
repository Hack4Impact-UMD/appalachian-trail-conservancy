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
  arrayUnion,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Volunteer, VolunteerID, User, Admin } from "../types/UserType";
import { Training, TrainingID, Quiz } from "../types/TrainingType";
import { Pathway, PathwayID } from "../types/PathwayType";

export function getUserWithAuth(auth_id: string): Promise<Admin | VolunteerID> {
  return new Promise((resolve, reject) => {
    const userRef = query(
      collection(db, "Users"),
      where("auth_id", "==", auth_id)
    );
    getDocs(userRef)
      .then((userSnapshot) => {
        if (userSnapshot.size > 0) {
          const userData = userSnapshot.docs[0].data() as User;
          if (userData.type === "ADMIN") {
            const adminData = userSnapshot.docs[0].data() as Admin;
            resolve({ ...adminData, id: userSnapshot.docs[0].id });
          } else {
            const volunteerData = userSnapshot.docs[0].data() as Volunteer;
            resolve({ ...volunteerData, id: userSnapshot.docs[0].id });
          }
        } else {
          reject(new Error("User does not exist"));
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

export function getQuiz(trainingId: string): Promise<Quiz> {
  return new Promise((resolve, reject) => {
    getTraining(trainingId)
      .then((data) => {
        if (data.quiz) {
          resolve(data.quiz);
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
  const trainingsRef = collection(db, "Trainings");
  return new Promise((resolve, reject) => {
    getDocs(trainingsRef)
      .then((trainingSnapshot) => {
        const allTrainings: TrainingID[] = [];
        const trainings = trainingSnapshot.docs.map((doc) => {
          const training: Training = doc.data() as Training;
          const newTraining: TrainingID = { ...training, id: doc.id };
          allTrainings.push(newTraining);
        });
        resolve(allTrainings);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getAllPathways(): Promise<PathwayID[]> {
  const pathwaysRef = collection(db, "Pathways");
  return new Promise((resolve, reject) => {
    getDocs(pathwaysRef)
      .then((pathwaySnapshot) => {
        const allPathways: PathwayID[] = [];
        const pathways = pathwaySnapshot.docs.map((doc) => {
          const pathway: Pathway = doc.data() as Pathway;
          const newPathway: PathwayID = { ...pathway, id: doc.id };
          allPathways.push(newPathway);
        });
        resolve(allPathways);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function addVolunteerTraining(
  volunteerId: string,
  trainingId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Retrieve the Firestore document reference for the volunteer user
    getUserWithAuth(volunteerId)
      .then((userData: VolunteerID) => {
        // Construct the Firestore document reference
        const volunteerDocRef = doc(db, 'Users', userData.id);
        // Update the document with the new training information
        updateDoc(volunteerDocRef, {
          // Use "arrayUnion" to append to the existing array
          trainingInformation: arrayUnion({
            trainingID: trainingId,
            progress: 'INPROGRESS',
            dateCompleted: '',
            numCompletedResources: 0,
            numTotalResources: 0,
            quizScoreReceived: 0,
          })
        }).then(() => {
          resolve(); // Successful
        }).catch((error) => {
          reject(error); // Error
        });
      })
      .catch((error) => {
        reject(error); // Error retrieving user data
      });
  });
}

export function addVolunteerPathway(
  volunteerId: string,
  pathwayId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Retrieve the Firestore document reference for the volunteer user
    getUserWithAuth(volunteerId)
      .then((userData: VolunteerID) => {
        // Construct the Firestore document reference
        const volunteerDocRef = doc(db, 'Users', userData.id);
        // Update the document with the new pathway information
        updateDoc(volunteerDocRef, {
          // Use "arrayUnion" to append to the existing array
          pathwayInformation: arrayUnion({
            pathwayID: pathwayId,
            progress: "INPROGRESS", // Assuming initial progress is "INPROGRESS"
            dateCompleted: "", // Initialize with empty string
            trainingsCompleted: [], // Initialize with empty array
            numTrainingsCompleted: 0, // Initialize with 0
            numTotalTrainings: 0, // Initialize with 0
          })
        }).then(() => {
          resolve(); // Successful
        }).catch((error) => {
          reject(error); // Error
        });
      })
      .catch((error) => {
        reject(error); // Error retrieving user data
      });
  });
}
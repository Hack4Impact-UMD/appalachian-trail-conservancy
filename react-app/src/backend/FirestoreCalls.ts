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

export function getVolunteer(id: string): Promise<Volunteer> {
  return new Promise((resolve, reject) => {
    getDoc(doc(db, "Users", id))
      .then((volunteerSnapshot) => {
        if (volunteerSnapshot.exists()) {
          resolve(volunteerSnapshot.data() as Volunteer);
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

export function updateVolunteer(
  volunteer: Volunteer,
  id: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === "" || !id) {
      reject(new Error("Invalid id"));
      return;
    }

    const volunteerRef = doc(db, "Users", id);
    updateDoc(volunteerRef, { ...volunteer })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function addVolunteerTraining(
  volunteerId: string,
  training: TrainingID
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Construct the Firestore document reference
    const volunteerRef = doc(db, "Users", volunteerId);
    getDoc(volunteerRef)
      .then((volunteerSnapshot) => {
        if (volunteerSnapshot.exists()) {
          const volunteer = volunteerSnapshot.data() as Volunteer;

          // Determine if training already exists in volunteer
          if (
            !volunteer.trainingInformation.some(
              (trainingInformation) =>
                trainingInformation.trainingID === training.id
            )
          ) {
            // Append new VolunteerTraining to existing volunteerInformation array
            volunteer.trainingInformation.push({
              trainingID: training.id,
              progress: "INPROGRESS",
              dateCompleted: "",
              numCompletedResources: 0,
              numTotalResources: training.resources.length, // total number of resources in training
            });

            // Add new training to volunteer's training information
            updateDoc(volunteerRef, {
              trainingInformation: volunteer.trainingInformation,
            });
          } else {
            reject(new Error("Training already exists in Volunteer"));
          }
        } else {
          reject(new Error("Volunteer does not exist"));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function addVolunteerPathway(
  volunteerId: string,
  pathway: PathwayID
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Construct the Firestore document reference
    const volunteerRef = doc(db, "Users", volunteerId);
    getDoc(volunteerRef)
      .then((volunteerSnapshot) => {
        if (volunteerSnapshot.exists()) {
          const volunteer = volunteerSnapshot.data() as Volunteer;

          // Determine if pathway already exists in volunteer
          if (
            !volunteer.pathwayInformation.some(
              (pathwayInformation) =>
                pathwayInformation.pathwayID === pathway.id
            )
          ) {
            // Append new VolunteerTraining to existing volunteerInformation array
            volunteer.pathwayInformation.push({
              pathwayID: pathway.id,
              progress: "INPROGRESS", // Assuming initial progress is "INPROGRESS"
              dateCompleted: "", // Initialize with empty string
              trainingsCompleted: [], // Initialize with empty array
              numTrainingsCompleted: 0, // Initialize with 0
              numTotalTrainings: pathway.trainingIDs.length, // Initialize with number of trainings in pathway
            });

            // Add new training to volunteer's training information
            updateDoc(volunteerRef, {
              pathwayInformation: volunteer.pathwayInformation,
            });
          } else {
            reject(new Error("Pathway already exists in Volunteer"));
          }
        } else {
          reject(new Error("Volunteer does not exist"));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

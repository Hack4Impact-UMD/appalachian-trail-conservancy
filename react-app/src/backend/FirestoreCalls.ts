import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Volunteer, VolunteerID, User, Admin } from "../types/UserType";
import { Training, TrainingID, Quiz } from "../types/TrainingType";
import { Pathway, PathwayID } from "../types/PathwayType";
import { ReauthKeyType } from "/Users/akashpatil/Documents/hack4impact/atc/appalachian-trail-conservancy/react-app/src/types/AssetsType";

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
export function getAllPublishedPathways(): Promise<PathwayID[]> {
  const pathwaysRef = collection(db, "Pathways");
  const publishedPathwaysQuery = query(
    pathwaysRef,
    where("status", "==", "PUBLISHED")
  );

  return new Promise((resolve, reject) => {
    getDocs(publishedPathwaysQuery)
      .then((pathwaySnapshot) => {
        const allPathways: PathwayID[] = pathwaySnapshot.docs.map((doc) => {
          const pathway: Pathway = doc.data() as Pathway;
          return { ...pathway, id: doc.id };
        });
        resolve(allPathways);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getReauthKey(email: string): Promise<ReauthKeyType> {
  return new Promise((resolve, reject) => {
    const assetsRef = collection(db, "Assets");
    const reAuthkeyQuery = query(
      assetsRef,
      where("type", "==", "REAUTHKEY"),
      where("email", "==", email)
    );

    getDocs(reAuthkeyQuery)
      .then((reAuthkeySnapshot) => {
        if (reAuthkeySnapshot.size > 0) {
          const reauthkey = reAuthkeySnapshot.docs[0].data() as ReauthKeyType;
          deleteDoc(reAuthkeySnapshot.docs[0].ref)
            .then(() => {
              resolve(reauthkey);
            })
            .catch((e) => {
              console.error(e);
              reject(new Error("Failed to delete reauth key"));
            });
        } else {
          reject(new Error("Reauth key does not exist"));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

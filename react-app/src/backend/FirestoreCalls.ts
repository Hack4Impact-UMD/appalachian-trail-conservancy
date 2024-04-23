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

export function addTraining(training: Training): Promise<void> {
  return new Promise((resolve, reject) => {
    /* runTransaction provides protection against race conditions where
       2 people are modifying the data at once. It also ensures that either
       all of these writes succeed or none of them do.
    */
    runTransaction(db, async (transaction) => {
      // add training
      await addDoc(collection(db, "Trainings"), training)
        .then(async (docRef) => {
          const trainingId = docRef.id;

          // get pathways associated with training
          const pathwayPromises = [];
          for (const pathwayId of training.associatedPathways) {
            pathwayPromises.push(
              transaction.get(doc(db, "Pathways", pathwayId))
            );
          }

          let pathwayRefList: any[] = [];
          await Promise.all(pathwayPromises)
            .then((pathwayRef) => {
              pathwayRefList = pathwayRef;
            })
            .catch(() => {
              reject(new Error("A pathway does not exist"));
            });

          if (trainingId) {
            const updatePromises = [];

            // add pathway to training's pathway list
            for (let i = 0; i < pathwayRefList.length; i++) {
              const pathwayRef = pathwayRefList[i];
              const pathway: Pathway = pathwayRef.data() as Pathway;
              pathway.trainingIDs.push(trainingId);
              updatePromises.push(
                transaction.update(
                  doc(db, "Pathways", training.associatedPathways[i]),
                  {
                    trainingIDs: pathway.trainingIDs,
                  }
                )
              );
            }

            await Promise.all(updatePromises)
              .then(() => {
                resolve();
              })
              .catch(() => {
                reject();
              });
          }
        })
        .catch((e) => {
          reject(e);
        });
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

export function updateTraining(training: Training, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === "" || !id) {
      reject(new Error("Invalid id"));
      return;
    }

    const trainingRef = doc(db, "Trainings", id);
    updateDoc(trainingRef, { ...training })
      .then(() => {
        resolve();
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

export function addPathway(pathway: Pathway): Promise<void> {
  return new Promise((resolve, reject) => {
    /* runTransaction provides protection against race conditions where
       2 people are modifying the data at once. It also ensures that either
       all of these writes succeed or none of them do.
    */
    runTransaction(db, async (transaction) => {
      // add pathway
      await addDoc(collection(db, "Pathways"), pathway)
        .then(async (docRef) => {
          const pathwayId = docRef.id;
          // get trainings associated with pathway
          const trainingPromises = [];
          for (const trainingId of pathway.trainingIDs) {
            trainingPromises.push(
              transaction.get(doc(db, "Trainings", trainingId))
            );
          }

          let trainingRefList: any[] = [];
          await Promise.all(trainingPromises)
            .then((trainingRef) => {
              trainingRefList = trainingRef;
            })
            .catch(() => {
              reject(new Error("A training does not exist"));
            });

          if (pathwayId) {
            const updatePromises = [];

            // add trainings to pathway's training list
            for (let i = 0; i < trainingRefList.length; i++) {
              const trainingRef = trainingRefList[i];
              const training: Training = trainingRef.data() as Training;
              training.associatedPathways.push(pathwayId);
              updatePromises.push(
                transaction.update(
                  doc(db, "Trainings", pathway.trainingIDs[i]),
                  {
                    associatedPathways: training.associatedPathways,
                  }
                )
              );
            }

            await Promise.all(updatePromises)
              .then(() => {
                resolve();
              })
              .catch(() => {
                reject();
              });
          }
        })
        .catch((e) => {
          reject(e);
        });
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

export function updatePathway(pathway: Pathway, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === "" || !id) {
      reject(new Error("Invalid id"));
      return;
    }

    const pathwayRef = doc(db, "Pathways", id);
    updateDoc(pathwayRef, { ...pathway })
      .then(() => {
        resolve();
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

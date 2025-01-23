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
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../config/firebase";
import {
  Volunteer,
  VolunteerID,
  VolunteerTraining,
  User,
  Admin,
  VolunteerPathway,
} from "../types/UserType";
import { Training, TrainingID, Quiz } from "../types/TrainingType";
import { Pathway, PathwayID } from "../types/PathwayType";

export function getVolunteers(): Promise<VolunteerID[]> {
  const collectionName = "Users";
  const collectionRef = collection(db, collectionName);

  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((userSnapshot) => {
        const allVolunteers: VolunteerID[] = [];
        const users = userSnapshot.docs.map((doc) => {
          const user = doc.data();
          if (user.type === "VOLUNTEER") {
            const newVolunteer = { ...user, id: doc.id } as VolunteerID;
            allVolunteers.push(newVolunteer);
          }
        });
        // .filter((user) => user.type === "VOLUNTEER"); // Filter for VOLUNTEER users only
        resolve(allVolunteers);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

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
    /* runTransaction provides protection against race conditions where
       2 people are modifying the data at once. It also ensures that either
       all of these writes succeed or none of them do.
    */
    runTransaction(db, async (transaction) => {
      // add training
      await addDoc(collection(db, "Trainings"), training)
        .then(async (docRef) => {
          const trainingId = docRef.id;

          resolve(trainingId);

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
                resolve("");
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
        resolve("");
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

export function deleteTraining(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === "" || !id) {
      reject(new Error("Invalid id"));
      return;
    }

    deleteDoc(doc(db, "Trainings", id))
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

export function validateQuiz(
  trainingId: string,
  volunteerId: string,
  volunteerAnswers: string[],
  timeCompleted: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const validateQuizResults = httpsCallable(functions, "validateQuizResults");
    validateQuizResults({
      trainingId,
      volunteerId,
      volunteerAnswers,
      timeCompleted,
    })
      .then((numAnswersCorrect) => {
        resolve(numAnswersCorrect);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function addPathway(pathway: Pathway): Promise<string> {
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

          resolve(pathwayId);

          // add trainings to pathway's training list if pathway is published
          if (pathway.status === "PUBLISHED") {
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
                  resolve("");
                })
                .catch(() => {
                  reject();
                });
            }
          }
        })
        .catch((e) => {
          reject(e);
        });
    })
      .then(() => {
        resolve("");
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
    runTransaction(db, async (transaction) => {
      const pathwayRef = doc(db, "Pathways", id);
      await updateDoc(pathwayRef, { ...pathway })
        .then(async () => {
          // update trainings in pathway's training list if pathway is published/archived
          if (pathway.status !== "DRAFT") {
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

            const updatePromises = [];

            for (let i = 0; i < trainingRefList.length; i++) {
              const trainingRef = trainingRefList[i];
              const training: Training = trainingRef.data() as Training;
              if (
                pathway.status === "PUBLISHED" &&
                !training.associatedPathways.includes(id)
              ) {
                // add training if it is not already associated with pathway
                training.associatedPathways.push(id);
              } else if (
                pathway.status === "ARCHIVED" &&
                training.associatedPathways.includes(id)
              ) {
                // remove training if it is associated with pathway
                training.associatedPathways =
                  training.associatedPathways.filter(
                    (trainingId) => trainingId !== id
                  );
              }

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

export function deletePathway(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === "" || !id) {
      reject(new Error("Invalid id"));
      return;
    }

    deleteDoc(doc(db, "Pathways", id))
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

export function getAllPublishedTrainings(): Promise<TrainingID[]> {
  const trainingsRef = collection(db, "Trainings");
  const publishedTrainingsQuery = query(
    trainingsRef,
    where("status", "==", "PUBLISHED")
  );

  return new Promise((resolve, reject) => {
    getDocs(publishedTrainingsQuery)
      .then((trainingSnapshot) => {
        const allTrainings: TrainingID[] = trainingSnapshot.docs.map((doc) => {
          const training: Training = doc.data() as Training;
          return { ...training, id: doc.id };
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

export function updateVolunteer(
  volunteer: Volunteer,
  id: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === "") {
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

export function updateVolunteerTraining(
  volunteerId: string,
  training: VolunteerTraining
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (training.trainingID === "" || !training.trainingID) {
      reject(new Error("Invalid trainingId"));
      return;
    }

    const volunteerRef = doc(db, "Users", volunteerId);
    getDoc(volunteerRef)
      .then((volunteerSnapshot) => {
        if (volunteerSnapshot.exists()) {
          const volunteer = volunteerSnapshot.data() as Volunteer;

          // Determine if training already exists in volunteer
          const existingTraining = volunteer.trainingInformation.find(
            (trainingInfo) => trainingInfo.trainingID === training.trainingID
          );

          if (existingTraining) {
            // Update the existing training record with new volunteerTraining data
            const updatedTrainingInformation =
              volunteer.trainingInformation.map((trainingInfo) => {
                if (trainingInfo.trainingID === training.trainingID) {
                  // Return updated training information
                  return {
                    ...trainingInfo,
                    ...training, // Spread the new training data here
                  };
                }
                return trainingInfo; // Return unchanged training info for other records
              });

            // Update the volunteer object with the new training information
            const updatedVolunteer = {
              ...volunteer,
              trainingInformation: updatedTrainingInformation,
            };

            // Now, save the updated volunteer object back to Firestore
            updateDoc(volunteerRef, updatedVolunteer)
              .then(() => {
                resolve();
                console.log("Volunteer training updated successfully");
              })
              .catch((error) => {
                reject("Error updating volunteer training:");
                console.error("Error updating volunteer training:", error);
              });
          } else {
            reject("Training not found in volunteer's training information.");
          }
        } else {
          reject("Volunteer does not exist.");
        }
      })
      .catch((error) => {
        reject("Error fetching volunteer");
        console.error("Error fetching volunteer:", error);
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
            })
              .then(() => {
                // Resolve the promise after the document is successfully updated
                resolve();
              })
              .catch((error) => {
                // Reject if updating the document fails
                reject(error);
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
  pathway: VolunteerPathway
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
                pathwayInformation.pathwayID === pathway.pathwayID
            )
          ) {
            // Append new VolunteerTraining to existing volunteerInformation array
            volunteer.pathwayInformation.push(pathway);

            // Add new pathway to volunteer's pathway information
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

export function updateVolunteerPathway(
  volunteerId: string,
  pathway: VolunteerPathway
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (pathway.pathwayID === "" || !pathway.pathwayID) {
      reject(new Error("Invalid pathwayID"));
      return;
    }

    const volunteerRef = doc(db, "Users", volunteerId);
    getDoc(volunteerRef)
      .then((volunteerSnapshot) => {
        if (volunteerSnapshot.exists()) {
          const volunteer = volunteerSnapshot.data() as Volunteer;

          // Determine if pathway already exists in volunteer
          const existingPathway = volunteer.pathwayInformation.find(
            (pathwayInfo) => pathwayInfo.pathwayID === pathway.pathwayID
          );

          if (existingPathway) {
            // Update the existing training record with new volunteerPathway data
            const updatedPathwayInformation = volunteer.pathwayInformation.map(
              (pathwayInfo) => {
                if (pathwayInfo.pathwayID === pathway.pathwayID) {
                  // Return updated pathway information
                  return {
                    ...pathwayInfo,
                    ...pathway, // Spread the new pathway data here
                  };
                }
                return pathwayInfo; // Return unchanged pathway info for other records
              }
            );

            // Update the volunteer object with the new pathway information
            const updatedVolunteer = {
              ...volunteer,
              pathwayInformation: updatedPathwayInformation,
            };

            // Now, save the updated volunteer object back to Firestore
            updateDoc(volunteerRef, updatedVolunteer)
              .then(() => {
                resolve();
                console.log("Volunteer pathway updated successfully");
              })
              .catch((error) => {
                reject("Error updating volunteer pathway:");
                console.error("Error updating volunteer pathway:", error);
              });
          } else {
            reject("Pathway not found in volunteer's pathway information.");
          }
        } else {
          reject("Volunteer does not exist.");
        }
      })
      .catch((error) => {
        reject("Error fetching volunteer");
        console.error("Error fetching volunteer:", error);
      });
  });
}

export function deleteUser(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    deleteDoc(doc(db, "Users", id))
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

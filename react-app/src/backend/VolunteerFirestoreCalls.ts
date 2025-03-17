import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../config/firebase";
import {
  Volunteer,
  VolunteerTraining,
  VolunteerPathway,
} from "../types/UserType";
import { Training, TrainingID } from "../types/TrainingType";

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

export function validateTrainingQuiz(
  trainingId: string,
  volunteerId: string,
  volunteerAnswers: string[],
  timeCompleted: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const validateTrainingQuizResults = httpsCallable(
      functions,
      "validateTrainingQuizResults"
    );
    validateTrainingQuizResults({
      trainingId,
      volunteerId,
      volunteerAnswers,
      timeCompleted,
    })
      .then((quizResults) => {
        resolve(quizResults);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function validatePathwayQuiz(
  pathwayId: string,
  volunteerId: string,
  volunteerAnswers: string[],
  timeCompleted: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const validatePathwayQuizResults = httpsCallable(
      functions,
      "validatePathwayQuizResults"
    );
    validatePathwayQuizResults({
      pathwayId,
      volunteerId,
      volunteerAnswers,
      timeCompleted,
    })
      .then((quizResults) => {
        resolve(quizResults);
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

            // Update volunteer pathway information if needed
            if (training.associatedPathways.length > 0) {
              volunteer.pathwayInformation.forEach((volunteerPathway) => {
                if (
                  training.associatedPathways.includes(
                    volunteerPathway.pathwayID
                  )
                ) {
                  // pathway exists in volunteer pathway list, add training to in progress list
                  volunteerPathway.trainingsInProgress.push(training.id);
                }
              });
            }

            // Add new training to volunteer's training information
            updateDoc(volunteerRef, {
              trainingInformation: volunteer.trainingInformation,
              pathwayInformation: volunteer.pathwayInformation,
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
            resolve();
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

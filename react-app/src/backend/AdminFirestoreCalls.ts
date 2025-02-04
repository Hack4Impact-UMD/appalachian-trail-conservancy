import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { EmailType, RegistrationCodeType } from "../types/AssetsType";
import { Admin, VolunteerID } from "../types/UserType";
import { Training } from "../types/TrainingType";
import { Pathway } from "../types/PathwayType";

export function getAdmin(id: string): Promise<Admin> {
  return new Promise((resolve, reject) => {
    getDoc(doc(db, "Users", id))
      .then((adminSnapshot) => {
        if (adminSnapshot.exists()) {
          resolve(adminSnapshot.data() as Admin);
        } else {
          reject(new Error("Admin does not exist"));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function updateAdmin(admin: Admin, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === "") {
      reject(new Error("Invalid id"));
      return;
    }

    const adminRef = doc(db, "Users", id);
    updateDoc(adminRef, { ...admin })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function addRegistrationEmail(email: EmailType): Promise<void> {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, "Assets"), email)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getRegistrationEmail(): Promise<EmailType> {
  return new Promise((resolve, reject) => {
    const assetsRef = collection(db, "Assets");
    const emailQuery = query(assetsRef, where("type", "==", "EMAIL"));

    getDocs(emailQuery)
      .then((emailSnapshot) => {
        if (emailSnapshot.size > 0) {
          const email = emailSnapshot.docs[0].data() as EmailType;
          resolve(email);
        } else {
          reject(new Error("Email does not exist"));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function updateRegistrationEmail(email: EmailType): Promise<void> {
  return new Promise((resolve, reject) => {
    if (
      email.subject === "" ||
      email.body === "" ||
      email.body === "<p><br></p>" // special case when quill editor is empty
    ) {
      reject(new Error("Invalid subject or body"));
      return;
    }

    const assetsRef = collection(db, "Assets");
    const emailQuery = query(assetsRef, where("type", "==", "EMAIL"));

    getDocs(emailQuery)
      .then((emailSnapshot) => {
        emailSnapshot.forEach((emailSnapshotRef) => {
          deleteDoc(emailSnapshotRef.ref).then(() => {
            addDoc(collection(db, "Assets"), email)
              .then(() => {
                resolve();
              })
              .catch((e) => {
                reject(e);
              });
          });
        });
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getRegistrationCode(): Promise<RegistrationCodeType> {
  return new Promise((resolve, reject) => {
    const assetsRef = collection(db, "Assets");
    const regCodeQuery = query(
      assetsRef,
      where("type", "==", "REGISTRATIONCODE")
    );

    getDocs(regCodeQuery)
      .then((regCodeSnapshot) => {
        if (regCodeSnapshot.size > 0) {
          const registrationCode =
            regCodeSnapshot.docs[0].data() as RegistrationCodeType;
          resolve(registrationCode);
        } else {
          reject(new Error("Registration Code does not exist"));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function updateRegistrationCode(
  registrationCode: RegistrationCodeType
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (registrationCode.code === "" || registrationCode.dateUpdated === "") {
      reject(new Error("Invalid subject or body"));
      return;
    }

    const assetsRef = collection(db, "Assets");
    const regCodeQuery = query(
      assetsRef,
      where("type", "==", "REGISTRATIONCODE")
    );

    getDocs(regCodeQuery)
      .then((regCodeSnapshot) => {
        regCodeSnapshot.forEach((regCodeSnapshot) => {
          deleteDoc(regCodeSnapshot.ref).then(() => {
            addDoc(collection(db, "Assets"), registrationCode)
              .then(() => {
                resolve();
              })
              .catch((e) => {
                reject(e);
              });
          });
        });
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function exportTableToCSV(data: any[]): void {
  if (!data || data.length === 0) {
    console.error("No data available to export.");
    return;
  }

  const headers: string[] = Object.keys(data[0]);

  // Create CSV content
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return typeof value === "string"
            ? `"${value.replace(/"/g, '""')}"`
            : value === null || value === undefined
            ? ""
            : value;
        })
        .join(",")
    ),
  ];

  const csvContent = csvRows.slice(1).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "export.csv";
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

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
        resolve(allVolunteers);
      })
      .catch((error) => {
        reject(error);
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

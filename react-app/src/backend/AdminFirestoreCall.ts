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
} from "../types/UserType";
import { Training, TrainingID, Quiz } from "../types/TrainingType";
import { Pathway, PathwayID } from "../types/PathwayType";
import { AssetsType, EmailType } from "../types/AssetsType";

export function updateEmail(email: EmailType): Promise<void> {
  return new Promise((resolve, reject) => {
    if (email.subject === "" || email.body === "") {
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

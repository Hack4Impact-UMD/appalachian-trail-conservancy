import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { EmailType } from "../types/AssetsType";

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

export function updateRegistrationEmail(email: EmailType): Promise<void> {
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

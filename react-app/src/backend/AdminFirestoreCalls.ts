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
} from "firebase/firestore";
import { db } from "../config/firebase";
import { EmailType } from "../types/AssetsType";
import { Admin } from "../types/UserType";

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

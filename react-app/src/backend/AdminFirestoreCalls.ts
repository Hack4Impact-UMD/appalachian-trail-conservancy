import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { EmailType, RegistrationCodeType } from "../types/AssetsType";

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

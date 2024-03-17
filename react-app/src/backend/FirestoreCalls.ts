import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export function basicGetter(): Promise<any[]> {
  // Add collectionName here
  const collectionName = '' 
  const collectionRef = collection(db, collectionName);
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot:any) => {
        const allDocuments:any = [];
        const documents = snapshot.docs.map((doc:any) => {
          const document = doc.data();
          const newStudent = { ...document, id: doc.id };
          allDocuments.push(newStudent);
        });
        resolve(allDocuments);
      })
      .catch((error:any) => {
        reject(error);
      });
  });
}

export function filteredGetter(): Promise<any[]> {
  // Add collectionName here
  const collectionName = '' 
  const collectionRef = query(
    collection(db, collectionName),
    /* Toss in conditions here*/
    where('type', '!=', 'ADMIN'),
  );
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot:any) => {
        const allDocuments:any = [];
        const documents = snapshot.docs.map((doc:any) => {
          const document = doc.data();
          const newStudent = { ...document, id: doc.id };
          allDocuments.push(newStudent);
        });
        resolve(allDocuments);
      })
      .catch((error:any) => {
        reject(error);
      });
  });
}

export function basicSetter(docToAdd:any): Promise<any> {
  return new Promise((resolve, reject) => {
    // Add collectionName here
    const collectionName = '' 
    addDoc(collection(db, collectionName), docToAdd)
      .then((docRef:any) => {
        // return id of document added
        resolve(docRef.id);
      })
      .catch((error:any) => {
        reject(error);
      });
  });
}

export function basicDeleter(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Add collectionName here
    const collectionName = '' 
    deleteDoc(doc(db, collectionName, id))
      .then(() => {
        resolve();
      })
      .catch((error:any) => {
        reject(error);
      });
  });
}


export function basicUpdater(newDocument: any, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === '' || !id) {
      reject(new Error('Invalid id'));
      return;
    }
    /* Add collection name here */
    const collectionName = ''
    const collectionRef = doc(db, collectionName, id);
    updateDoc(collectionRef, { ...newDocument })
      .then(() => {
        resolve();
      })
      .catch((error:any) => {
        reject(error);
      });
  });
}

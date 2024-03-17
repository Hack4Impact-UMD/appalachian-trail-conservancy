import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  type AuthError,
  type User,
} from 'firebase/auth';
import app, { functions } from '../config/firebase';
import { httpsCallable } from 'firebase/functions';

/*
Updates the logged-in user's password.
Shouldn't face the re-authentication issue because password is provided to re-authenticate within the function.

TODO: make error messages change properly.
 */
export async function updateUserPassword(
  newPassword: string,
  oldPassword: string,
): Promise<string> {
  return await new Promise((resolve, reject) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user != null) {
      const credential = EmailAuthProvider.credential(user.email!, oldPassword);
      reauthenticateWithCredential(user, credential)
        .then(async () => {
          updatePassword(user, newPassword)
            .then(() => {
              resolve('Successfully updated password');
            })
            .catch((error: any) => {
              const code = (error as AuthError).code;
              if (code === 'auth/weak-password') {
                reject('New password should be at least 6 characters');
              } else {
                reject('Error updating password. Please try again later.');
              }
            });
        })
        .catch((error: any) => {
          const code = (error as AuthError).code;
          if (code === 'auth/wrong-password') {
            reject('Your original password is incorrect.');
          } else if (code === 'auth/too-many-request') {
            reject(`Access to this account has been temporarily disabled due to many failed
            login attempts or due to too many failed password resets. Please try again later`);
          } else {
            reject('Failed to authenticate user. Please log in again.');
          }
        });
    } else {
      reject('Session expired. Please sign in again.');
    }
  });
}

/*
 * Creates a user and sends a password reset email to that user.
 */
export function createUser(newEmail: string, newRole: string): Promise<void> {
  return new Promise((resolve, reject) => {
    /* If role isn't one of the expected ones, reject it.*/
    if (newRole != 'TEACHER' && newRole != 'ADMIN') {
      reject();
    }
    const createUserCloudFunction = httpsCallable(functions, 'createUser');
    const auth = getAuth(app);

    createUserCloudFunction({ email: newEmail, role: newRole })
      .then(async () => {
        await sendPasswordResetEmail(auth, newEmail)
          .then(() => {
            resolve();
          })
          .catch((error: any) => {
            reject();
          });
      })
      .catch((error: any) => {
        reject();
      });
  });
}

/*
 * Creates a user and sends a password reset email to that user.
 */
export function setUserRole(auth_id: string, newRole: string): Promise<void> {
  return new Promise((resolve, reject) => {
    /* If roles are not one of the expected ones, reject it*/
    if (newRole != 'TEACHER' && newRole != 'ADMIN') {
      reject('Role must be TEACHER or ADMIN');
    }
    const setUserCloudFunction = httpsCallable(functions, 'setUserRole');
    setUserCloudFunction({ firebase_id: auth_id, role: newRole })
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

/*
 * Deletes a user given their auth id
 */
export function deleteUser(auth_id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const deleteUserCloudFunction = httpsCallable(functions, 'deleteUser');

    deleteUserCloudFunction({ firebase_id: auth_id })
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function updateUserEmail(
  oldEmail: string,
  currentEmail: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const updateUserEmailCloudFunction = httpsCallable(
      functions,
      'updateUserEmail',
    );

    updateUserEmailCloudFunction({ email: oldEmail, newEmail: currentEmail })
      .then(async (res: any) => {
        resolve();
      })
      .catch((error: any) => {
        console.log(error);
        reject(error);
      });
  });
}

export function authenticateUser(
  email: string,
  password: string,
): Promise<User> {
  return new Promise((resolve, reject) => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        resolve(userCredential.user);
      })
      .catch((error: AuthError) => {
        reject(error);
      });
  });
}

export function logOut(): Promise<void> {
  return new Promise((resolve, reject) => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function sendResetEmail(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const auth = getAuth(app);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

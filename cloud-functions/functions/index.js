const cors = require("cors")({ origin: true });
const crypto = require("crypto");
const functions = require("firebase-functions");
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const dotenv = require("dotenv");
require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground"
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.REFRESH_TOKEN,
// });

// const accessToken = oauth2Client.getAccessToken();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: process.env.EMAIL,
//     accessToken: accessToken,
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     refreshToken: process.env.REFRESH_TOKEN,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const baseEmail = {
  subject: "Welcome to the ATC Training Portal",
  body: `
    <div>
      <div style="max-width: 600px; margin: auto">
        <br><br><br>
        <p style="font-size: 16px">
        Hello,<br>
        <br>
        Your account has been created.<br>
        <br>
        <span style="font-weight: 600; text-decoration: underline">Appalachian Trail Conservancy Training Portal</span><br>
        <br>
      <div>
    </div>
  `,
};

/*
 * Creates a new volunteer.
 * Takes an object as a parameter that should contain an email, first name, and last name.
 * A volunteer will only be created if the join code is correct.
 * Arguments: email: string, the user's email
 *            first name: string, the user's first name
 *            last name: string, the user's last name
 */

exports.createVolunteerUser = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      // pull registration code from firestore
      let registrationCode;
      await db
        .collection("Assets")
        .where("type", "==", "REGISTRATIONCODE")
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length == 0) {
            throw new Error("No registration code exists");
          }
          registrationCode = querySnapshot.docs[0].data();
        })
        .catch((error) => {
          reject({
            reason: "Registration Code Query Failed",
            text: "Unable to find registration code in the database.",
          });
          throw new functions.https.HttpsError("unknown", `${error}`);
        });

      if (data?.code === registrationCode.code) {
        await authorization
          .createUser({
            email: data.email,
          })
          .then(async (userRecord) => {
            await authorization
              .setCustomUserClaims(userRecord.uid, {
                role: "VOLUNTEER",
              })
              .then(async () => {
                const collectionObject = {
                  auth_id: userRecord.uid,
                  email: data.email,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  type: "VOLUNTEER",
                  trainingInformation: [],
                  pathwayInformation: [],
                };

                await db
                  .collection("Users")
                  .where("auth_id", "==", userRecord.uid)
                  .get()
                  .then(async (querySnapshot) => {
                    if (querySnapshot.docs.length == 0) {
                      await db
                        .collection("Users")
                        .add(collectionObject)
                        .then(async () => {
                          // get email template from DB or use base email
                          let email;
                          await db
                            .collection("Assets")
                            .where("type", "==", "EMAIL")
                            .get()
                            .then(async (querySnapshot) => {
                              if (querySnapshot.docs.length != 0) {
                                email = querySnapshot.docs[0].data();
                              } else {
                                // Email has not been set by ATC Admin, defer to base email
                                email = baseEmail;
                              }

                              email = {
                                ...email,
                                body: email.body
                                  .replace("FIRSTNAME", data.firstName)
                                  .replace("LASTNAME", data.lastName),
                              };
                              console.log("pls send");
                              //send email to Volunteer
                              await transporter
                                .sendMail({
                                  from: '"ATC" <h4iatctest2@gmail.com>',
                                  to: data.email,
                                  subject: email.subject,
                                  html: email.body,
                                })
                                .then(() => {
                                  resolve({
                                    reason: "Success",
                                    text: "Success",
                                  });
                                })
                                .catch((error) => {
                                  console.log(error);
                                  reject({
                                    reason: "Intro Email Not Sent",
                                    text: "User has been created, but the introduction email failed to be sent to them.",
                                  });
                                  throw new functions.https.HttpsError(
                                    "Unknown",
                                    "Unable to send introduction email to new user."
                                  );
                                });
                            })
                            .catch((error) => {
                              reject({
                                reason: "Email Query Failed",
                                text: "Unable to find email in the database.",
                              });
                              throw new functions.https.HttpsError(
                                "unknown",
                                `${error}`
                              );
                            });
                        })
                        .catch((error) => {
                          reject({
                            reason: "Database Add Failed",
                            text: "User has been created in login, but has not been added to database.",
                          });
                          throw new functions.https.HttpsError(
                            "Unknown",
                            "Failed to add user to database"
                          );
                        });
                    } else {
                      // User already in database
                      reject({
                        reason: "Database Add Failed",
                        text: "User already in database.",
                      });
                      throw new functions.https.HttpsError(
                        "Unknown",
                        "Failed to add user to database"
                      );
                    }
                  })
                  .catch((error) => {
                    reject({
                      reason: "Database Email Query Failed",
                      text: "Unable to find email in the database. Make sure it exists.",
                    });
                    throw new functions.https.HttpsError("unknown", `${error}`);
                  });
              })
              .catch((error) => {
                reject({
                  reason: "Role Set Failed",
                  text: "User has been created, but their role was not set properly",
                });
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Failed to set user's role"
                );
              });
          })
          .catch((error) => {
            reject({
              reason: "Creation Failed",
              text: "Failed to create user. Please make sure the email is not already in use.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Failed to create user in the auth."
            );
          });
      } else {
        reject({
          reason: "Permission Denied",
          text: "Invalid join code.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "Invalid join code."
        );
      }
    });
  }
);

/*
 * Creates a new admin.
 * Takes an object as a parameter that should contain an email, first name, and last name.
 * Arguments: email: string, the user's email
 *            first name: string, the user's first name
 *            last name: string, the user's last name
 */
exports.createAdminUser = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      if (auth && auth.token && auth.token.role == "ADMIN") {
        const authorization = admin.auth();
        const pass = crypto.randomBytes(32).toString("hex");
        await authorization
          .createUser({
            email: data.email,
            password: pass,
          })
          .then(async (userRecord) => {
            await authorization
              .setCustomUserClaims(userRecord.uid, {
                role: "ADMIN",
              })
              .then(async () => {
                const collectionObject = {
                  auth_id: userRecord.uid,
                  email: data.email,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  type: "ADMIN",
                };
                await db
                  .collection("Users")
                  .where("auth_id", "==", userRecord.uid)
                  .get()
                  .then(async (querySnapshot) => {
                    if (querySnapshot.docs.length == 0) {
                      await db
                        .collection("Users")
                        .add(collectionObject)
                        .then(async () => {
                          resolve({ reason: "Success", text: "Success" });
                        })
                        .catch((error) => {
                          reject({
                            reason: "Database Add Failed",
                            text: "User has been created in login, but has not been added to database.",
                          });
                          throw new functions.https.HttpsError(
                            "Unknown",
                            "Failed to add user to database"
                          );
                        });
                    } else {
                      // User already in database
                      reject({
                        reason: "Database Add Failed",
                        text: "User already in database.",
                      });
                      throw new functions.https.HttpsError(
                        "Unknown",
                        "Failed to add user to database"
                      );
                    }
                  })
                  .catch((error) => {
                    reject({
                      reason: "Database Deletion Failed",
                      text: "Unable to find user in the database. Make sure they exist.",
                    });
                    throw new functions.https.HttpsError("unknown", `${error}`);
                  });
              })
              .catch((error) => {
                reject({
                  reason: "Role Set Failed",
                  text: "User has been created, but their role was not set properly",
                });
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Failed to set user's role"
                );
              });
          })
          .catch((error) => {
            reject({
              reason: "Creation Failed",
              text: "Failed to create user. Please make sure the email is not already in use.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Failed to create user in the auth."
            );
          });
      } else {
        reject({
          reason: "Permission Denied",
          text: "Only an admin user can create admin users. If you are an admin, make sure the email and name passed in are correct.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only an admin user can create admin users. If you are an admin, make sure the email and name passed into the function are correct."
        );
      }
    });
  }
);

/**
 * Deletes the user
 * Argument: firebase_id - the user's firebase_id
 */

exports.deleteUser = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.firebase_id != null &&
        auth &&
        auth.token &&
        auth.token.role.toLowerCase() == "admin"
      ) {
        await authorization
          .deleteUser(data.firebase_id)
          .then(async () => {
            const promises = [];
            await db
              .collection("Users")
              .where("auth_id", "==", data.firebase_id)
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.docs.length == 0) {
                  throw new functions.https.HttpsError(
                    "Unknown",
                    "Unable to find user with that firebase id in the database"
                  );
                } else {
                  querySnapshot.forEach((documentSnapshot) => {
                    promises.push(documentSnapshot.ref.delete());
                  });
                }
              })
              .catch((error) => {
                reject({
                  reason: "Database Deletion Failed",
                  text: "Unable to find user in the database. Make sure they exist.",
                });
                throw new functions.https.HttpsError("unknown", `${error}`);
              });
            await Promise.all(promises)
              .then(() => {
                resolve({ reason: "Success", text: "Success" });
              })
              .catch((error) => {
                reject({
                  reason: "Database Deletion Failed",
                  text: "Unable to delete user from the database.",
                });
                throw new functions.https.HttpsError("unknown", `${error}`);
              });
          })
          .catch((error) => {
            reject({
              reason: "Auth Deletion Failed",
              text: "Unable to delete user from login system. Make sure they exist.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Unable to delete user."
            );
          });
      } else {
        reject({
          reason: "Permissions",
          text: "Only an admin user can delete users. If you are an admin, make sure the account exists.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only an admin user can delete users. If you are an admin, make sure the account exists."
        );
      }
    });
  }
);
/**
 * Updates a user's email
 * Arguments: email - the user's current email
 *            newEmail - the user's new email
 * TODO: Update Error Codes
 */

exports.updateUserEmail = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.email != null &&
        data.newEmail != null &&
        auth &&
        auth.token &&
        auth.token.email.toLowerCase() == data.email.toLowerCase()
      ) {
        await authorization
          .updateUser(auth.uid, {
            email: data.newEmail,
          })
          .then(async () => {
            await db
              .collection("Users")
              .where("auth_id", "==", auth.uid)
              .get()
              .then(async (querySnapshot) => {
                if (querySnapshot.docs.length == 0) {
                  reject({
                    reason: "Database Change Failed",
                    text: "User's email has been changed for login, but failed to find user's email within the database.",
                  });
                  throw new functions.https.HttpsError(
                    "Unknown",
                    "Unable to find user with that email in the database"
                  );
                } else {
                  const promises = [];
                  querySnapshot.forEach((doc) => {
                    promises.push(doc.ref.update({ email: data.newEmail }));
                  });
                  await Promise.all(promises)
                    .then(() => {
                      resolve({
                        reason: "Success",
                        text: "Successfully changed email.",
                      });
                    })
                    .catch(() => {
                      reject({
                        reason: "Database Change Failed",
                        text: "User's email has been changed for login, but failed to find user's email within the database.",
                      });
                      throw new functions.https.HttpsError(
                        "Unknown",
                        "Failed to change user's email within the database."
                      );
                    });
                }
              })
              .catch((error) => {
                reject({
                  reason: "Database Change Failed",
                  text: "User's email has been changed for login, but failed to find user's email within the database.",
                });
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Unable to find user with that email in the database"
                );
              });
          })
          .catch((error) => {
            reject({
              reason: "Auth Change Failed",
              text: "Failed to change user's email within the login system.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Failed to change user's email."
            );
          });
      } else {
        reject({
          reason: "Permissions",
          text: "You do not have the correct permissions to update email. If you think you do, please make sure the new email is not already in use.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "You do not have the correct permissions to update email."
        );
      }
    });
  }
);

/**
 * Changes a user's role in both authorization and the database.
 * Takes an object as a parameter that should contain a firebase_id field and a role field.
 * This function can only be called by a user with admin status
 * Arguments: firebase_id - the id of the user
 *            role: the user's new role; string, (Options: "ADMIN", "TEACHER")
 */

exports.setUserRole = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.firebase_id != null &&
        data.role != null &&
        auth &&
        auth.token &&
        auth.token.role.toLowerCase() == "admin"
      ) {
        authorization
          .setCustomUserClaims(data.firebase_id, { role: data.role })
          .then(async () => {
            await db
              .collection("Users")
              .where("auth_id", "==", data.firebase_id)
              .get()
              .then(async (querySnapshot) => {
                if (querySnapshot.docs.length == 0) {
                  throw new functions.https.HttpsError(
                    "Unknown",
                    "Unable to find user with that firebase id in the database"
                  );
                } else {
                  const promises = [];
                  querySnapshot.forEach((doc) => {
                    promises.push(doc.ref.update({ type: data.role }));
                  });
                  await Promise.all(promises)
                    .then(() => {
                      return { result: "OK" };
                    })
                    .catch(() => {
                      throw new functions.https.HttpsError(
                        "Unknown",
                        "Unable to update user role in database"
                      );
                    });
                }
              })
              .catch((error) => {
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Unable to find user with that firebase id in the database"
                );
              });
          })
          .catch((error) => {
            throw new functions.https.HttpsError(
              "Unknown",
              "Failed to change user role."
            );
          });
      } else {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only an admin user can change roles. If you are an admin, make sure the arguments passed into the function are correct."
        );
      }
    });
  }
);

/**
 * This function validates a Volunteer's quiz answers
 *
 * Arguments: trainingId, volunteerAnswers, volunteerID
 *
 * Retrieves training information, then checks the volunteers answers against
 * the quiz answers from the Training data. Retrieves and updates the Volunteer's
 * volunteerTraining data corresponding to the current Training given that
 * they recieved a higher score or was their first time taking the quiz
 */
exports.validateTrainingQuizResults = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const { trainingId, volunteerAnswers, volunteerId, timeCompleted } = data;
      if (
        // Validate auth
        auth &&
        auth.token &&
        auth.token.role.toLowerCase() == "volunteer" &&
        // Validate parameters here
        trainingId &&
        volunteerAnswers &&
        volunteerId &&
        timeCompleted
      ) {
        await db
          .collection("Trainings")
          .doc(trainingId)
          .get()
          .then(async (trainingSnapshot) => {
            if (trainingSnapshot.exists) {
              const trainingData = trainingSnapshot.data();
              const { quiz } = trainingData;
              const { questions } = quiz;

              if (questions.length === volunteerAnswers.length) {
                // Check Volunteer answers against quiz answers
                const numAnswersCorrect = questions.reduce(
                  (acc, question, idx) => {
                    return volunteerAnswers[idx] === question.answer
                      ? acc + 1
                      : acc;
                  },
                  0
                );

                // Get Volunteer data
                const volunteerData = await db
                  .collection("Users")
                  .doc(volunteerId)
                  .get()
                  .then((volunteerSnapshot) => volunteerSnapshot.data())
                  .catch((error) => {
                    reject({
                      reason: "database-retrieval-failed",
                      text: "Unable to find volunteer in the database. Make sure they exist.",
                    });
                    throw new functions.https.HttpsError("unknown", `${error}`);
                  });

                let volunteerTrainingInfo =
                  volunteerData.trainingInformation.find(
                    (volunteerTraining) =>
                      volunteerTraining.trainingID === trainingId
                  );

                if (volunteerTrainingInfo) {
                  if (
                    volunteerTrainingInfo.quizScoreRecieved == undefined ||
                    volunteerTrainingInfo.quizScoreRecieved <= numAnswersCorrect
                  ) {
                    // Update volunteerTraining if quiz score does not exist or higher score is recieved
                    volunteerTrainingInfo.quizScoreRecieved = numAnswersCorrect;
                    volunteerTrainingInfo.dateCompleted = timeCompleted;
                    volunteerTrainingInfo.progress =
                      numAnswersCorrect >= quiz.passingScore
                        ? "COMPLETED"
                        : "INPROGRESS";

                    // Update VolunteerTraining list
                    let newVolunteerTraining = [];
                    volunteerData.trainingInformation.forEach(
                      (volunteerTraining) => {
                        newVolunteerTraining.push(
                          volunteerTraining.trainingID === trainingId
                            ? volunteerTrainingInfo
                            : volunteerTraining
                        );
                      }
                    );

                    // Update VolunteerPathway list
                    if (numAnswersCorrect >= quiz.passingScore) {
                      if (trainingData.associatedPathways.length > 0) {
                        await Promise.all(
                          volunteerData.pathwayInformation.map(
                            async (volunteerPathway) => {
                              if (
                                trainingData.associatedPathways.includes(
                                  volunteerPathway.pathwayID
                                )
                              ) {
                                // Pathway exists in volunteer pathway list, add to completed list and remove from in-progress list
                                if (
                                  !volunteerPathway.trainingsCompleted.includes(
                                    trainingId
                                  )
                                ) {
                                  volunteerPathway.trainingsCompleted.push(
                                    trainingId
                                  );
                                }
                                volunteerPathway.trainingsInProgress =
                                  volunteerPathway.trainingsInProgress.filter(
                                    (id) => id !== trainingId
                                  );

                                // Retrieve pathway data
                                const pathwayData = await db
                                  .collection("Pathways")
                                  .doc(volunteerPathway.pathwayID)
                                  .get()
                                  .then((pathwaySnapshot) =>
                                    pathwaySnapshot.data()
                                  )
                                  .catch((error) => {
                                    reject({
                                      reason: "database-retrieval-failed",
                                      text: "Unable to find pathway in the database.",
                                    });
                                    throw new functions.https.HttpsError(
                                      "unknown",
                                      `${error}`
                                    );
                                  });

                                let consecutiveCompletion = false;

                                // Check to see if training is next one on completed list
                                let trainingIndex =
                                  pathwayData.trainingIDs.indexOf(trainingId);
                                if (trainingIndex !== -1) {
                                  if (
                                    trainingIndex ===
                                    volunteerPathway.numTrainingsCompleted
                                  ) {
                                    volunteerPathway.numTrainingsCompleted++;
                                    consecutiveCompletion = true;
                                  }

                                  // Check for consecutive completions
                                  let i = trainingIndex + 1;
                                  while (consecutiveCompletion) {
                                    let nextTrainingId =
                                      pathwayData.trainingIDs[i];
                                    if (
                                      volunteerPathway.trainingsCompleted.includes(
                                        nextTrainingId
                                      )
                                    ) {
                                      volunteerPathway.numTrainingsCompleted++;
                                      i++;
                                    } else {
                                      consecutiveCompletion = false;
                                    }
                                  }
                                }
                              }
                            }
                          )
                        );
                      }
                    }
                    // Update the Volunteer document in firestore
                    const updateVolunteer = await db
                      .collection("Users")
                      .doc(volunteerId)
                      .update({
                        trainingInformation: newVolunteerTraining,
                        pathwayInformation: volunteerData.pathwayInformation,
                      })
                      .catch((error) => {
                        reject({
                          reason: "database-update-failed",
                          text: "Unable to update Volunteer in the database.",
                        });
                        throw new functions.https.HttpsError(
                          "unknown",
                          `${error}`
                        );
                      });
                  }

                  // Resolve with score
                  resolve([numAnswersCorrect, volunteerTrainingInfo]);
                } else {
                  // Volunteer is not enrolled in Training
                  throw new functions.https.HttpsError(
                    "volunteer-not-enrolled-in-training",
                    "the volunteer is not enrolled in the training"
                  );
                }

                resolve([numAnswersCorrect, volunteerTrainingInfo]);
              } else {
                // Training quiz length and volunteer list of answers are unequal length
                throw new functions.https.HttpsError(
                  "invalid-volunteer-answers",
                  "the volunteer's answers is of wrong length"
                );
              }
            } else {
              // Training does not exist given the Training id parameter
              throw new functions.https.HttpsError(
                "invalid-parameter",
                "Training does not exist with the given id"
              );
            }
          })
          .catch((error) => {
            reject({
              reason: "database-retrieval-failed",
              text: "Unable to find training in the database. Make sure it exists.",
            });
            throw new functions.https.HttpsError("unknown", `${error}`);
          });
      } else {
        throw new functions.https.HttpsError(
          "invalid-parameters",
          "Function was called with invalid parameters."
        );
      }
    });
  }
);

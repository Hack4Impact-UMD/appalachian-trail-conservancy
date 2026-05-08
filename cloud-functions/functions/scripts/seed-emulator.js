/* eslint-disable no-console */
const admin = require("firebase-admin");

const PROJECT_ID = process.env.GCLOUD_PROJECT || "atc-training-aa43c";
process.env.GCLOUD_PROJECT = PROJECT_ID;
process.env.FIRESTORE_EMULATOR_HOST =
  process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST =
  process.env.FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";

function assertLocalEmulatorHost(host, serviceName) {
  if (!host.includes("127.0.0.1") && !host.includes("localhost")) {
    throw new Error(
      `${serviceName} must point to a local emulator, received: ${host}`
    );
  }
}

assertLocalEmulatorHost(process.env.FIRESTORE_EMULATOR_HOST, "Firestore");
assertLocalEmulatorHost(process.env.FIREBASE_AUTH_EMULATOR_HOST, "Auth");

admin.initializeApp({ projectId: PROJECT_ID });

const auth = admin.auth();
const db = admin.firestore();

const TEST_PASSWORD = "LocalPass123!";
const nowIso = new Date().toISOString();

const trainingIds = {
  basics: "training-trail-basics",
  safety: "training-safety-readiness",
  habitat: "training-habitat-stewardship",
  communication: "training-communication-skills",
  climate: "training-climate-change-impacts",
  maintenance: "training-trail-maintenance",
  monitoring: "training-ecological-monitoring",
};
const pathwayId = "pathway-stewardship-basics";
const advancedPathwayId = "pathway-advanced-skills";
const legacyVolunteer = {
  uid: "volunteer-complete-emulator-uid",
  userDocId: "volunteer-complete-emulator",
};

const users = [
  {
    uid: "admin-emulator-uid",
    email: "admin+emulator@atc.local",
    password: TEST_PASSWORD,
    claims: { role: "ADMIN" },
    userDocId: "admin-emulator",
    userDoc: {
      auth_id: "admin-emulator-uid",
      email: "admin+emulator@atc.local",
      firstName: "Alex",
      lastName: "Admin",
      type: "ADMIN",
    },
  },
  {
    uid: "volunteer-emulator-uid",
    email: "h4iatctest@gmail.com",
    password: TEST_PASSWORD,
    claims: { role: "VOLUNTEER" },
    userDocId: "volunteer-emulator",
    userDoc: {
      auth_id: "volunteer-emulator-uid",
      email: "h4iatctest@gmail.com",
      firstName: "Vera",
      lastName: "Volunteer",
      type: "VOLUNTEER",
      trainingInformation: [
        {
          trainingID: trainingIds.basics,
          progress: "COMPLETED",
          dateCompleted: nowIso,
          numCompletedResources: 2,
          numTotalResources: 2,
          quizScoreRecieved: 1,
        },
        {
          trainingID: trainingIds.safety,
          progress: "COMPLETED",
          dateCompleted: nowIso,
          numCompletedResources: 2,
          numTotalResources: 2,
          quizScoreRecieved: 1,
        },
        {
          trainingID: trainingIds.habitat,
          progress: "COMPLETED",
          dateCompleted: nowIso,
          numCompletedResources: 2,
          numTotalResources: 2,
          quizScoreRecieved: 1,
        },
        {
          trainingID: trainingIds.communication,
          progress: "INPROGRESS",
          dateCompleted: "",
          numCompletedResources: 1,
          numTotalResources: 2,
        },
        {
          trainingID: trainingIds.maintenance,
          progress: "INPROGRESS",
          dateCompleted: "",
          numCompletedResources: 0,
          numTotalResources: 2,
        },
        {
          trainingID: trainingIds.climate,
          progress: "INPROGRESS",
          dateCompleted: "",
          numCompletedResources: 0,
          numTotalResources: 2,
        },
        {
          trainingID: trainingIds.monitoring,
          progress: "INPROGRESS",
          dateCompleted: "",
          numCompletedResources: 0,
          numTotalResources: 2,
        },
      ],
      pathwayInformation: [
        {
          pathwayID: pathwayId,
          progress: "COMPLETED",
          dateCompleted: nowIso,
          trainingsCompleted: [
            trainingIds.basics,
            trainingIds.safety,
            trainingIds.habitat,
          ],
          trainingsInProgress: [],
          numTrainingsCompleted: 3,
          numTotalTrainings: 3,
          quizScoreRecieved: 1,
        },
        {
          pathwayID: advancedPathwayId,
          progress: "INPROGRESS",
          dateCompleted: "",
          trainingsCompleted: [],
          trainingsInProgress: [
            trainingIds.communication,
            trainingIds.maintenance,
          ],
          numTrainingsCompleted: 0,
          numTotalTrainings: 4,
        },
      ],
    },
  },
];

async function removeLegacyVolunteerIfPresent() {
  try {
    await auth.deleteUser(legacyVolunteer.uid);
  } catch (error) {
    if (error.code !== "auth/user-not-found") {
      throw error;
    }
  }

  await db.collection("Users").doc(legacyVolunteer.userDocId).delete();
}

const trainingDocs = [
  {
    id: trainingIds.basics,
    data: {
      name: "Trail Basics",
      shortBlurb: "Safety and stewardship essentials for new volunteers.",
      description:
        "An intro training that covers safety, Leave No Trace basics, and reporting expectations.",
      coverImage:
        "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80",
      resources: [
        {
          type: "VIDEO",
          title: "Trail Safety Overview",
          link: "https://www.youtube.com/watch?v=9No-FiEInLA",
        },
        {
          type: "PDF",
          title: "Volunteer Handbook",
          link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
      quiz: {
        numQuestions: 1,
        passingScore: 1,
        questions: [
          {
            question: "Which principle is central to trail stewardship?",
            choices: [
              "Leave No Trace",
              "Maximize campfire size",
              "Take souvenirs from the trail",
            ],
            answer: "Leave No Trace",
          },
        ],
      },
      associatedPathways: [pathwayId],
      status: "PUBLISHED",
    },
  },
  {
    id: trainingIds.safety,
    data: {
      name: "Safety Readiness",
      shortBlurb:
        "Prepare for hazards, weather shifts, and emergency response.",
      description:
        "Covers risk awareness, route planning, weather checks, and escalation protocols before fieldwork.",
      coverImage:
        "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80",
      resources: [
        {
          type: "VIDEO",
          title: "Trail Risk Scenarios",
          link: "https://www.youtube.com/watch?v=8jLOx1hD3_o",
        },
        {
          type: "PDF",
          title: "Field Safety Checklist",
          link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
      quiz: {
        numQuestions: 1,
        passingScore: 1,
        questions: [
          {
            question: "What is the best first step before entering the field?",
            choices: [
              "Skip planning to save time",
              "Check conditions and safety plan",
              "Wait for others to decide",
            ],
            answer: "Check conditions and safety plan",
          },
        ],
      },
      associatedPathways: [pathwayId],
      status: "PUBLISHED",
    },
  },
  {
    id: trainingIds.habitat,
    data: {
      name: "Habitat Stewardship",
      shortBlurb: "Learn practical actions for protecting trail ecosystems.",
      description:
        "Focuses on identifying impact zones, minimizing disturbance, and reporting habitat concerns.",
      coverImage:
        "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&w=1200&q=80",
      resources: [
        {
          type: "VIDEO",
          title: "Protecting Sensitive Areas",
          link: "https://www.youtube.com/watch?v=ysf9D8k6Qf0",
        },
        {
          type: "PDF",
          title: "Habitat Observation Guide",
          link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
      quiz: {
        numQuestions: 1,
        passingScore: 1,
        questions: [
          {
            question:
              "How should volunteers respond to sensitive habitat areas?",
            choices: [
              "Create shortcuts around them",
              "Avoid disturbance and report concerns",
              "Move markers without approval",
            ],
            answer: "Avoid disturbance and report concerns",
          },
        ],
      },
      associatedPathways: [pathwayId],
      status: "PUBLISHED",
    },
  },
  {
    id: trainingIds.communication,
    data: {
      name: "Communication Skills",
      shortBlurb: "Master effective communication in the field and with teams.",
      description:
        "Covers team coordination, reporting findings, and communicating with stakeholders on trail projects.",
      coverImage:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      resources: [
        {
          type: "VIDEO",
          title: "Team Communication Best Practices",
          link: "https://www.youtube.com/watch?v=gE2a6UwI8VA",
        },
        {
          type: "PDF",
          title: "Field Report Template",
          link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
      quiz: {
        numQuestions: 1,
        passingScore: 1,
        questions: [
          {
            question: "How should you report a safety concern to your team?",
            choices: [
              "Wait until the end of the day",
              "Communicate immediately and document the issue",
              "Post it on social media",
            ],
            answer: "Communicate immediately and document the issue",
          },
        ],
      },
      associatedPathways: [pathwayId, advancedPathwayId],
      status: "PUBLISHED",
    },
  },
  {
    id: trainingIds.climate,
    data: {
      name: "Climate Change Impacts",
      shortBlurb: "Understand climate effects on trail ecosystems.",
      description:
        "Explores how climate change affects trail conditions, wildlife, and volunteer strategy.",
      coverImage:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
      resources: [
        {
          type: "VIDEO",
          title: "Climate Trends and Trail Systems",
          link: "https://www.youtube.com/watch?v=YCWdcr6lT0g",
        },
        {
          type: "PDF",
          title: "Climate Adaptation Guide",
          link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
      quiz: {
        numQuestions: 1,
        passingScore: 1,
        questions: [
          {
            question: "What is a key sign of climate impact on trails?",
            choices: [
              "Increased erosion and drainage issues",
              "Fewer volunteers",
              "Better weather every year",
            ],
            answer: "Increased erosion and drainage issues",
          },
        ],
      },
      associatedPathways: [advancedPathwayId],
      status: "PUBLISHED",
    },
  },
  {
    id: trainingIds.maintenance,
    data: {
      name: "Trail Maintenance Techniques",
      shortBlurb: "Learn hands-on maintenance methods for trail repair.",
      description:
        "Covers tool safety, proper maintenance techniques, and best practices for sustainable repairs.",
      coverImage:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      resources: [
        {
          type: "VIDEO",
          title: "Tool Use and Safety",
          link: "https://www.youtube.com/watch?v=5mMn7Zx--OI",
        },
        {
          type: "PDF",
          title: "Maintenance Techniques Guide",
          link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
      quiz: {
        numQuestions: 1,
        passingScore: 1,
        questions: [
          {
            question:
              "What is the first step before using any trail maintenance tool?",
            choices: [
              "Start using it immediately",
              "Verify proper training and safety inspection",
              "Ask someone to watch",
            ],
            answer: "Verify proper training and safety inspection",
          },
        ],
      },
      associatedPathways: [advancedPathwayId],
      status: "PUBLISHED",
    },
  },
  {
    id: trainingIds.monitoring,
    data: {
      name: "Ecological Monitoring",
      shortBlurb: "Document and track ecosystem health indicators.",
      description:
        "Learn observation techniques for monitoring wildlife, vegetation, and trail impact on ecosystems.",
      coverImage:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
      resources: [
        {
          type: "VIDEO",
          title: "Ecosystem Observation Basics",
          link: "https://www.youtube.com/watch?v=7v5Y5H1tJGQ",
        },
        {
          type: "PDF",
          title: "Wildlife and Vegetation Guide",
          link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
      quiz: {
        numQuestions: 1,
        passingScore: 1,
        questions: [
          {
            question: "What should you do when observing rare wildlife?",
            choices: [
              "Get as close as possible for photos",
              "Document from a distance and report observations",
              "Leave the trail to follow it",
            ],
            answer: "Document from a distance and report observations",
          },
        ],
      },
      associatedPathways: [advancedPathwayId],
      status: "PUBLISHED",
    },
  },
];

const pathwayDoc = {
  name: "Stewardship Basics",
  shortBlurb: "Core learning path for first-time ATC volunteers.",
  description:
    "A starter pathway that prepares volunteers for safe and informed field participation.",
  coverImage:
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
  trainingIDs: [trainingIds.basics, trainingIds.safety, trainingIds.habitat],
  quiz: {
    numQuestions: 1,
    passingScore: 1,
    questions: [
      {
        question: "What should you do when you find trail damage?",
        choices: [
          "Ignore it",
          "Document and report it through ATC channels",
          "Post only on social media",
        ],
        answer: "Document and report it through ATC channels",
      },
    ],
  },
  status: "PUBLISHED",
};

const advancedPathwayDoc = {
  name: "Advanced Skills Development",
  shortBlurb: "Deepen expertise with specialized training modules.",
  description:
    "An intermediate pathway for volunteers ready to expand their skills in communication, maintenance, climate awareness, and ecological monitoring.",
  coverImage:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  trainingIDs: [
    trainingIds.communication,
    trainingIds.maintenance,
    trainingIds.climate,
    trainingIds.monitoring,
  ],
  quiz: {
    numQuestions: 1,
    passingScore: 1,
    questions: [
      {
        question:
          "Which of these is a best practice for advanced volunteer work?",
        choices: [
          "Work in isolation to maximize efficiency",
          "Integrate communication, maintenance expertise, and environmental awareness",
          "Skip safety checks if running behind schedule",
        ],
        answer:
          "Integrate communication, maintenance expertise, and environmental awareness",
      },
    ],
  },
  status: "PUBLISHED",
};

const assetsDocs = [
  {
    id: "registration-code",
    data: {
      type: "REGISTRATIONCODE",
      dateUpdated: nowIso,
      code: "ATC-EMULATOR-2026",
    },
  },
  {
    id: "registration-email",
    data: {
      type: "EMAIL",
      dateUpdated: nowIso,
      subject: "Welcome to Appalachian Trail Learning Pathways",
      body: "<p>Hello FIRSTNAME LASTNAME,</p><p>Welcome to the emulator environment.</p>",
    },
  },
  {
    id: "reauth-key-demo",
    data: {
      type: "REAUTHKEY",
      dateUpdated: nowIso,
      email: "admin+emulator@atc.local",
      key: "demo-reauth-key",
    },
  },
];

async function upsertAuthUser(user) {
  let existingUser;
  try {
    existingUser = await auth.getUser(user.uid);
  } catch (error) {
    if (error.code !== "auth/user-not-found") {
      throw error;
    }
  }

  if (existingUser) {
    await auth.updateUser(user.uid, {
      email: user.email,
      password: user.password,
      emailVerified: true,
      disabled: false,
    });
  } else {
    await auth.createUser({
      uid: user.uid,
      email: user.email,
      password: user.password,
      emailVerified: true,
      disabled: false,
    });
  }

  await auth.setCustomUserClaims(user.uid, user.claims);
}

async function upsertFirestoreDocs() {
  for (const training of trainingDocs) {
    await db
      .collection("Trainings")
      .doc(training.id)
      .set(training.data, { merge: true });
  }

  await db
    .collection("Pathways")
    .doc(pathwayId)
    .set(pathwayDoc, { merge: true });

  await db
    .collection("Pathways")
    .doc(advancedPathwayId)
    .set(advancedPathwayDoc, { merge: true });

  for (const asset of assetsDocs) {
    await db
      .collection("Assets")
      .doc(asset.id)
      .set(asset.data, { merge: true });
  }

  for (const user of users) {
    await db
      .collection("Users")
      .doc(user.userDocId)
      .set(user.userDoc, { merge: true });
  }
}

async function seed() {
  console.log("Seeding Firebase emulators...");
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Firestore host: ${process.env.FIRESTORE_EMULATOR_HOST}`);
  console.log(`Auth host: ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);

  await removeLegacyVolunteerIfPresent();

  for (const user of users) {
    await upsertAuthUser(user);
  }

  await upsertFirestoreDocs();

  console.log("Seed complete.");
  console.log("Seeded users:");
  users.forEach((user) => console.log(`- ${user.email} (${user.claims.role})`));
  console.log(
    `Seeded training IDs: ${trainingDocs.map((training) => training.id).join(", ")}`
  );
  console.log(`Seeded pathway ID: ${pathwayId}`);
  console.log("Seeded registration code: ATC-EMULATOR-2026");
  console.log(`Seeded auth password: ${TEST_PASSWORD}`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });

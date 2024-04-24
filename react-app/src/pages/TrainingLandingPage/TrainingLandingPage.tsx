import styles from "./TrainingLandingPage.module.css";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { whiteButtonGrayBorder, forestGreenButton } from "../../muiTheme";
import { Training, TrainingResource } from "../../types/TrainingType";
import { type VolunteerTraining } from "../../types/UserType";
import { getTraining } from "../../backend/FirestoreCalls";
import { LinearProgress, Box, Typography, Button } from "@mui/material";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import CompletedIcon from "../../assets/completedCheck.svg";
import Loading from "../../components/LoadingScreen/Loading";

const styledButtons = {
  marginRight: "10%",
  marginLeft: "1%",
};

const styledProgressShape = {
  height: 24,
  borderRadius: 12,
  width: "100%",
};

// if score > 0, dark green & light gray
const styledProgressPass = {
  ...styledProgressShape,
  backgroundColor: "lightgray",
  "& .MuiLinearProgress-bar": {
    backgroundColor: "var(--forest-green)",
  },
};

function TrainingLandingPage() {
  const [loading, setLoading] = useState<boolean>(true);
  // If training & volunteerTraining is passed via state, then set it accordingly. Otherwise, retrieve training via id from url parameter then check if a VolunteerTraining exists for it
  const [volunteerTraining, setVolunteerTraining] = useState<VolunteerTraining>(
    {
      trainingID: "GQf4rBgvJ4uU9Is89wXp",
      progress: "COMPLETED",
      dateCompleted: "",
      numCompletedResources: 5,
      numTotalResources: 5,
      quizScoreRecieved: 0,
    }
  );

  const [training, setTraining] = useState<Training>({
    name: "How to pet a cat",
    shortBlurb: "",
    description: "blah blah blah",
    coverImage: "",
    resources: [
      { type: "VIDEO", link: "https://example.com/video1", title: "Video 1" },
      { type: "PDF", link: "https://example.com/article1", title: "Article 1" },
      { type: "PDF", link: "https://example.com/article1", title: "Article 2" },
      { type: "PDF", link: "https://example.com/article1", title: "Article 3" },
    ],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    associatedPathways: [],
    certificationImage: "",
  });

  const trainingId = useParams().id;
  const location = useLocation();

  useEffect(() => {
    if (trainingId !== undefined && !location.state?.training) {
      getTraining(trainingId)
        .then(async (trainingData) => {
          setTraining(trainingData);
          // Get volunteer training
        })
        .catch(() => {
          console.log("Failed to get training");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const renderTrainingResources = () => {
    return training.resources.map(
      (resource: TrainingResource, index: number) => (
        <div key={index}>
          <div className={styles.trainingRow}>
            <div
              className={`${styles.trainingInfo} ${
                volunteerTraining.trainingID !== "" &&
                (index + 1 <= volunteerTraining.numCompletedResources
                  ? styles.opacityContainer
                  : "")
              }`}>
              <p className={styles.trainingNumber}>{index + 1}</p>
              <p className={styles.trainingTitle}>{resource.title}</p>
              <p className={styles.trainingType}>{resource.type}</p>
            </div>
            <div>
              {/* Conditionally render an image if resource is completed */}
              {(volunteerTraining.trainingID !== "" &&
                index + 1 <= volunteerTraining.numCompletedResources && (
                  <img
                    className={styles.completedIcon}
                    src={CompletedIcon}
                    alt="Completed"
                  />
                )) ||
                (volunteerTraining.trainingID !== "" &&
                  volunteerTraining.progress === "INPROGRESS" && (
                    <div
                      className={`${styles.marker} ${styles.progressMarker}`}>
                      IN PROGRESS
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )
    );
  };

  const renderMarker = () => {
    if (volunteerTraining.trainingID === "") {
      // Training not started
      return (
        <div className={`${styles.marker} ${styles.notStartedMarker}`}>
          NOT STARTED
        </div>
      );
    } else if (
      volunteerTraining.trainingID !== "" &&
      volunteerTraining.numCompletedResources ===
        volunteerTraining.numTotalResources
    ) {
      // Training completed
      return (
        <div className={`${styles.marker} ${styles.progressMarker}`}>
          COMPLETED
        </div>
      );
    }
    // Training in progress
    else
      return (
        <div className={`${styles.marker} ${styles.progressMarker}`}>
          IN PROGRESS
        </div>
      );
  };

  const renderButton = () => {
    if (
      volunteerTraining.trainingID === "" ||
      (volunteerTraining && volunteerTraining.numCompletedResources === 0)
    ) {
      return (
        <Button
          sx={{ ...forestGreenButton, ...styledButtons }}
          variant="contained">
          Start
        </Button>
      );
    } else if (volunteerTraining && volunteerTraining.quizScoreRecieved != 0) {
      return (
        <Button
          sx={{ ...forestGreenButton, ...styledButtons }}
          variant="contained">
          Restart
        </Button>
      );
    } else {
      return (
        <Button
          sx={{ ...forestGreenButton, ...styledButtons }}
          variant="contained">
          Resume
        </Button>
      );
    }
  };

  return (
    <>
      <NavigationBar />

      <div className={`${styles.split} ${styles.right}`}>
        {loading ? (
          <Loading />
        ) : (
          <div className={styles.outerContainer}>
            <div className={styles.bodyContainer}>
              {/* HEADER */}
              <div className={styles.header}>
                <h1 className={styles.nameHeading}>{training.name}</h1>
                <ProfileIcon />
              </div>

              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (volunteerTraining &&
                        (volunteerTraining.numCompletedResources /
                          volunteerTraining.numTotalResources) *
                          100) ||
                      0
                    }
                    sx={styledProgressPass}
                  />
                  <Box sx={{ minWidth: 35 }}>
                    <Typography
                      variant="body2"
                      color="var(--blue-gray)"
                      sx={{ fontSize: "15px" }}>
                      {(volunteerTraining &&
                        (volunteerTraining.numCompletedResources /
                          volunteerTraining.numTotalResources) *
                          100 +
                          "%") ||
                        "0%"}
                    </Typography>
                  </Box>
                </div>
                <div>{renderMarker()}</div>
              </div>

              {/* ABOUT */}
              <div className={styles.container}>
                <h2>About</h2>
                <p>{training.description}</p>
              </div>

              {/* OVERVIEW */}
              <div className={styles.container}>
                <h2>Overview</h2>
                {renderTrainingResources()}
                <div className={styles.trainingRowFinal}>
                  <div
                    className={`${styles.trainingInfo} ${
                      volunteerTraining.trainingID !== "" &&
                      (volunteerTraining.progress === "COMPLETED"
                        ? styles.opacityContainer
                        : "")
                    }`}>
                    <p className={styles.trainingNumber}>
                      {volunteerTraining.numTotalResources}
                    </p>
                    <p className={styles.trainingTitle}>Quiz</p>
                  </div>
                  <div>
                    {/* Conditionally render an image if quiz is completed */}
                    {volunteerTraining.trainingID !== "" &&
                      volunteerTraining.progress === "COMPLETED" && (
                        <img
                          className={styles.completedIcon}
                          src={CompletedIcon}
                          alt="Completed"
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* footer */}
        <div className={styles.footer}>
          <Button sx={{ ...whiteButtonGrayBorder }} variant="contained">
            Back
          </Button>
          {renderButton()}
        </div>
      </div>
    </>
  );
}

export default TrainingLandingPage;

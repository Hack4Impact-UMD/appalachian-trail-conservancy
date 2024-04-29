import styles from "./TrainingLandingPage.module.css";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { whiteButtonGrayBorder, forestGreenButton } from "../../muiTheme";
import { TrainingID, TrainingResource } from "../../types/TrainingType";
import { type VolunteerTraining } from "../../types/UserType";
import { getTraining } from "../../backend/FirestoreCalls";
import { LinearProgress, Box, Typography, Button } from "@mui/material";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import CompletedIcon from "../../assets/completedCheck.svg";
import Loading from "../../components/LoadingScreen/Loading";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const trainingId = useParams().id;
  const location = useLocation();

  // If training & volunteerTraining is passed via state, then set it accordingly.
  // Otherwise, retrieve training via id from url parameter then check if a VolunteerTraining exists for it

  const [training, setTraining] = useState<TrainingID>({
    name: "How to pet a cat",
    id: "",
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

  const [volunteerTraining, setVolunteerTraining] = useState<VolunteerTraining>(
    {
      trainingID: "",
      progress: "INPROGRESS",
      dateCompleted: "",
      numCompletedResources: 0,
      numTotalResources: training.resources.length,
      quizScoreRecieved: 0,
    }
  );

  useEffect(() => {
    if (trainingId !== undefined && !location.state?.training) {
      // Fetch data only if trainingId is available
      if (trainingId !== undefined) {
        getTraining(trainingId)
          .then((trainingData) => {
            setTraining(trainingData);
            setVolunteerTraining(location.state.volunteerTraining);
          })
          .catch(() => {
            console.log("Failed to get training");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      // Update state with data from location's state
      if (location.state.training) {
        setTraining(location.state.training);
      }
      if (location.state.volunteerTraining) {
        setVolunteerTraining(location.state.volunteerTraining);
      }
      setLoading(false);
    }
  }, [trainingId, location.state]);

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
              }`}
            >
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
                      className={`${styles.marker} ${styles.progressMarker}`}
                    >
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
          sx={{ ...forestGreenButton }} 
          variant="contained"
          onClick={() =>
            navigate(`/trainings/resources/:${training.id}/${0}`, {
              state: { training: training, volunteerTraining: volunteerTraining }
            })
          }>
          Start
        </Button>
      );
    } else if (volunteerTraining.numCompletedResources == volunteerTraining.numTotalResources) {
      return (
        <Button 
        sx={{ ...forestGreenButton }} 
        variant="contained"
        onClick={() =>
          navigate(`/trainings/resources/:${training.id}/${0}`, {
            state: { training: training, volunteerTraining: volunteerTraining }
          })
        }
        >
          Restart
        </Button>
      );
    } else {
      return (
        <Button 
        sx={{ ...forestGreenButton }} 
        variant="contained"
        onClick={() =>
          navigate(`/trainings/resources/:${training.id}/${volunteerTraining.numCompletedResources}}`, {
            state: { training: training, volunteerTraining: volunteerTraining }
          })
        }>
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
                      sx={{ fontSize: "15px" }}
                    >
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
                    }`}
                  >
                    <p className={styles.trainingNumber}>
                      {volunteerTraining.numTotalResources + 1}
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
          <div className={styles.footerButtons}>
            <Button sx={{ ...whiteButtonGrayBorder }} variant="contained">
              Back
            </Button>
            {renderButton()}
          </div>
        </div>
      </div>
    </>
  );
}

export default TrainingLandingPage;

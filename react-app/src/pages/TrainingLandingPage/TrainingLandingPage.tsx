import { whiteButtonGrayBorder } from "../../muiTheme";
import { TrainingResource } from "../../types/TrainingType";
import styles from "./TrainingLandingPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { LinearProgress, Box, Typography } from "@mui/material";
import { type Training } from "../../types/TrainingType";
import { type VolunteerTraining } from "../../types/UserType";
import { Button } from "@mui/material";
import { forestGreenButton } from "../../muiTheme";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import CompletedIcon from "../../assets/greenCircleCheck.svg";

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

const isCompleted = (volunteer: VolunteerTraining): boolean => {
  return volunteer.numCompletedResources === volunteer.numTotalResources;
};

function TrainingLandingPage() {
  const volunteer: VolunteerTraining = {
    trainingID: "",
    progress: "INPROGRESS",
    dateCompleted: "",
    numCompletedResources: 1,
    numTotalResources: 4,
    quizScoreRecieved: 0,
  };

  const training: Training = {
    name: "How to pet a cat",
    description: "blah blah blah",
    coverImage: "",
    resources: [
      { type: "VIDEO", link: "https://example.com/video1", title: "Video 1" },
      { type: "PDF", link: "https://example.com/article1", title: "Article 1" },
      { type: "PDF", link: "https://example.com/article1", title: "Article 2" },
    ],
    quizID: "",
    associatedPathways: [],
    certificationImage: "",
  };

  const renderTrainingResources = () => {
    return training.resources.map(
      (resource: TrainingResource, index: number) => (
        <div key={index}>
          <div className={styles.trainingRow}>
            <div
              className={`${styles.trainingInfo} ${
                index + 1 <= volunteer.numCompletedResources
                  ? styles.opacityContainer
                  : ""
              }`}
            >
              <p className={styles.trainingNumber}>{index + 1}</p>
              <p className={styles.trainingTitle}>{resource.title}</p>
              <p className={styles.trainingType}>{resource.type}</p>
            </div>
            {/* Conditionally render an image if training is completed */}
            {(index + 1 <= volunteer.numCompletedResources && (
              <img
                className={styles.completedIcon}
                src={CompletedIcon}
                alt="Completed"
              />
            )) ||
              (index + 1 == volunteer.numCompletedResources + 1 && (
                <img
                  className={styles.completedIcon}
                  src={CompletedIcon} // change to progress icon
                  alt="Completed"
                />
              ))}
          </div>
        </div>
      )
    );
  };

  const renderMarker = () => {
    if (volunteer.numCompletedResources === 0) {
      // Training not started
      return (
        <div className={`${styles.marker} ${styles.notStartedMarker}`}>
          NOT STARTED
        </div>
      );
    } else if (
      volunteer.numCompletedResources === volunteer.numTotalResources
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
    if (volunteer.numCompletedResources === 0) {
      return (
        <Button
          sx={{ ...forestGreenButton, ...styledButtons }}
          variant="contained"
        >
          Start
        </Button>
      );
    } else if (volunteer.quizScoreRecieved != 0) {
      return (
        <Button
          sx={{ ...forestGreenButton, ...styledButtons }}
          variant="contained"
        >
          Restart
        </Button>
      );
    } else {
      return (
        <Button
          sx={{ ...forestGreenButton, ...styledButtons }}
          variant="contained"
        >
          Resume
        </Button>
      );
    }
  };

  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
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
                  value={50}
                  sx={styledProgressPass}
                />
                <Box sx={{ minWidth: 35 }}>
                  <Typography
                    variant="body2"
                    color="var(--blue-gray)"
                    sx={{ fontSize: "15px" }}
                  >
                    {"50%"}
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
                <div className={styles.trainingInfo}>
                  <p className={styles.trainingNumber}>
                    {volunteer.numTotalResources}
                  </p>
                  <p className={styles.trainingTitle}>Quiz</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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

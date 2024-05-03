import { useState, useEffect, SetStateAction } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { whiteButtonGrayBorder, forestGreenButton } from "../../muiTheme";
import { TrainingID, TrainingResource, Training } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType";
import { type VolunteerTraining, VolunteerPathway } from "../../types/UserType";
import { getAllPathways, getTraining } from "../../backend/FirestoreCalls";
import { getPathway } from "../../backend/FirestoreCalls";
import { LinearProgress, Box, Typography, Button } from "@mui/material";
import styles from "./PathwayLandingPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import CompletedIcon from "../../assets/completedCheck.svg";
import Loading from "../../components/LoadingScreen/Loading";

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

 function PathwayLandingPage() {
  const navigate = useNavigate();
  const pathwayId = useParams().id;
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);

  // If training & volunteerTraining is passed via state, then set it accordingly.
  // Otherwise, retrieve training via id from url parameter then check if a VolunteerTraining exists for it
  const [pathway, setPathway] = useState<PathwayID>({
    name: "",
    id: "",
    shortBlurb: "",
    description: "",
    coverImage: "",
    trainingIDs: [],
    badgeImage: "",
  });

  const [volunteerPathway, setVolunteerPathway] = useState<VolunteerPathway>(
    {
        pathwayID: "",
        progress: "INPROGRESS",
        dateCompleted: "",
        trainingsCompleted: [],
        numTrainingsCompleted: 0,
        numTotalTrainings: 0,
    }
  );

  const [allTrainings, setAllTrainings] = useState<Training[]>([]);

  useEffect(() => {
    if (pathwayId !== undefined && !location.state?.pathway) {
        setLoading(true); 
      if (pathwayId !== undefined) {
        getPathway(pathwayId)
          .then(async (pathwayData) => {
            setPathway(pathwayData);
            setVolunteerPathway(location.state.volunteerPathway);

            //make array of Trainings for pathway
            const trainingPromises = pathwayData.trainingIDs.map(trainingId => getTraining(trainingId));
            const allTrainingsData = await Promise.all(trainingPromises);
            setAllTrainings(allTrainingsData);
          })
          .catch(() => {
            console.log("Failed to get pathway");
          })
          .finally(() => {
            setLoading(false); 
          });
      }
    } else {
      if (location.state.pathway) {
        setPathway(location.state.pathway);
      }
      if (location.state.volunteerPathway) {
        setVolunteerPathway(location.state.volunteerPathway);
      }
      if (location.state.training) {
        setAllTrainings(location.state.training);
        setLoading(false); 
      } else {
        const trainingPromises = pathway.trainingIDs.map(trainingId => getTraining(trainingId));
        Promise.all(trainingPromises)
          .then(allTrainingsData => {
            setAllTrainings(allTrainingsData);
          })
          .catch(() => {
            console.log("Failed to get training data");
          })
          .finally(() => {
            console.log(pathway);
            console.log(volunteerPathway);
            console.log(allTrainings);
            setLoading(false); 
          });
      }
    }

  }, [pathwayId, location.state]);

  const renderTrainingResources = () => {
    return allTrainings.map((training: Training, index: number) => (
      <div key={index}>
        <div className={styles.trainingRow}>
          {/* conditionally render opacity of training titles */}
          <div
            className={`${styles.trainingInfo} ${
              volunteerPathway.pathwayID !== "" &&
              (index + 1 <= volunteerPathway.numTrainingsCompleted
                ? styles.opacityContainer
                : "")
            }`}
          >
            {/* row for each training */}
            <p className={styles.trainingNumber}>{index + 1}</p>
            <p className={styles.trainingTitle}>{training.name}</p>
          </div>
          <div>
              {/* conditionally render completed icon if resource is completed */}
              {(volunteerPathway.pathwayID !== "" &&
                index + 1 <= volunteerPathway.numTrainingsCompleted && (
                  <img
                    className={styles.completedIcon}
                    src={CompletedIcon}
                    alt="Completed"
                  />
                )) ||
                (volunteerPathway.pathwayID !== "" &&
                  volunteerPathway.progress === "INPROGRESS" && (
                    <div
                      className={`${styles.marker} ${styles.progressMarker}`}>
                      IN PROGRESS
                    </div>
                  ))}
            </div>
        </div>
      </div>
    ));
  };

  const renderMarker = () => {
    if (volunteerPathway.pathwayID === "") {
      // Training not started
      return (
        <div className={`${styles.marker} ${styles.notStartedMarker}`}>
          NOT STARTED
        </div>
      );
    } else if (
      volunteerPathway.pathwayID !== "" &&
      volunteerPathway.numTrainingsCompleted ===
        volunteerPathway.numTotalTrainings
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
      volunteerPathway.pathwayID === "" ||
      (volunteerPathway && volunteerPathway.numTrainingsCompleted === 0)
    ) {
      return (
        <Button
        sx={{ ...forestGreenButton }}
        variant="contained"
        onClick={() =>
          navigate(`/pathways`, {
            state: {
              pathway: pathway,
              volunteerPathway: volunteerPathway,
              fromApp: true,
            },
          })
        }>
          Start
        </Button>
      );
    } else if (
      volunteerPathway.numTrainingsCompleted ==
      volunteerPathway.numTotalTrainings
    ) {
      return (
        <Button
          sx={{ ...forestGreenButton }}
          variant="contained"
          onClick={() =>
            navigate(`/pathways`, {
              state: {
                pathway: pathway,
                volunteerPathway: volunteerPathway,
                fromApp: true,
              },
            })
          }>
          Restart
        </Button>
      );
    } else {
      return (
        <Button
          sx={{ ...forestGreenButton }}
          variant="contained"
          onClick={() =>
            navigate(`/pathways`, {
              state: {
                pathway: pathway,
                volunteerPathway: volunteerPathway,
                fromApp: true,
              },
            })
          }>
          Resume
        </Button>
      );
    }
  };

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />

      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}>
        {loading ? (
          <Loading />
        ) : (
          <div className={styles.outerContainer}>
            <div className={styles.bodyContainer}>
              {/* HEADER */}
              <div className={styles.header}>
                <h1 className={styles.nameHeading}>{pathway.name}</h1>
                <ProfileIcon />
              </div>

              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      volunteerPathway.pathwayID !== ""
                        ? (volunteerPathway.numTrainingsCompleted /
                            volunteerPathway.numTotalTrainings) *
                          100
                        : 0
                    }
                    sx={styledProgressPass}
                  />
                  <Box sx={{ minWidth: 35 }}>
                    <Typography
                      variant="body2"
                      color="var(--blue-gray)"
                      sx={{ fontSize: "15px" }}>
                      {volunteerPathway.pathwayID !== ""
                        ? (volunteerPathway.numTrainingsCompleted /
                            volunteerPathway.numTotalTrainings) *
                            100 +
                          "%"
                        : "0%"}
                    </Typography>
                  </Box>
                </div>
                <div>{renderMarker()}</div>
              </div>

              {/* ABOUT */}
              <div className={styles.container}>
                <h2>About</h2>
                <p>{pathway.description}</p>
              </div>

              {/* OVERVIEW */}
              <div className={styles.container}>
                <h2>Overview</h2>
                {renderTrainingResources()}
                <div className={styles.trainingRowFinal}>
                  <div
                    className={`${styles.trainingInfo} ${
                      volunteerPathway.pathwayID !== "" &&
                      (volunteerPathway.progress === "COMPLETED"
                        ? styles.opacityContainer
                        : "")
                    }`}>
                    <p className={styles.trainingNumber}>
                      {pathway.trainingIDs.length + 1}
                    </p>
                    <p className={styles.trainingTitle}>Quiz</p>
                  </div>
                  <div>
                    {/* Conditionally render an image if quiz is completed */}
                    {volunteerPathway.pathwayID !== "" &&
                      volunteerPathway.progress === "COMPLETED" && (
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
            <Button
              sx={{ ...whiteButtonGrayBorder }}
              variant="contained"
              onClick={() => navigate(-1)}>
              Back
            </Button>
            {renderButton()}
          </div>
        </div>
      </div>
    </>
  );
}

export default PathwayLandingPage;

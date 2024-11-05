import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { whiteButtonGrayBorder, forestGreenButton } from "../../muiTheme";
import { TrainingID, TrainingResource } from "../../types/TrainingType";
import { VolunteerTraining } from "../../types/UserType";
import {
  getVolunteer,
  getTraining,
  getPathway,
  addVolunteerTraining,
} from "../../backend/FirestoreCalls";
import { Button } from "@mui/material";
import { useAuth } from "../../auth/AuthProvider";
import styles from "./TrainingLandingPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import CompletedIcon from "../../assets/completedCheck.svg";
import Loading from "../../components/LoadingScreen/Loading";
import hamburger from "../../assets/hamburger.svg";

function TrainingLandingPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const trainingId = useParams().id;
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [pathwayNames, setPathwayNames] = useState<
    { name: string; id: string }[]
  >([]);

  // If training & volunteerTraining is passed via state, then set it accordingly.
  // Otherwise, retrieve training via id from url parameter then check if a VolunteerTraining exists for it
  const [training, setTraining] = useState<TrainingID>({
    name: "",
    id: "",
    shortBlurb: "",
    description: "",
    coverImage: "",
    resources: [],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    associatedPathways: [],
    certificationImage: "",
    status: "DRAFT",
  });

  const [volunteerTraining, setVolunteerTraining] = useState<VolunteerTraining>(
    {
      trainingID: "",
      progress: "INPROGRESS",
      dateCompleted: "",
      numCompletedResources: 0,
      numTotalResources: training.resources.length,
    }
  );

  const fetchPathwayNames = async (associatedPathways: string[]) => {
    try {
      const pathwayPromises = associatedPathways.map((pathway) =>
        getPathway(pathway)
      );
      const pathways = await Promise.all(pathwayPromises);
      let associatedPathwayNames: { name: string; id: string }[] = [];
      pathways.forEach((pathway) =>
        associatedPathwayNames.push({
          name: pathway.name.toUpperCase(),
          id: pathway.id,
        })
      );
      setPathwayNames(associatedPathwayNames);
    } catch (error) {
      console.log("Failed to get pathways");
    }
  };

  useEffect(() => {
    if (
      trainingId !== undefined &&
      !location.state?.training &&
      !location.state?.volunteerTraining
    ) {
      setLoading(true);

      // fetch data if trainingId is available and if auth is finished loading
      if (trainingId !== undefined && !auth.loading && auth.id) {
        getTraining(trainingId)
          .then((trainingData) => {
            setTraining(trainingData);
            // since no state is passed from navigation, get current user data
            getVolunteer(auth.id.toString())
              .then(async (volunteerData) => {
                // filter volunteer training information to find current pathway
                const VolunteerTraining =
                  volunteerData.trainingInformation.filter(
                    (volunteerTraining) =>
                      volunteerTraining.trainingID === trainingId
                  );

                // only replace if pathway exists
                if (VolunteerTraining.length > 0)
                  setVolunteerTraining(VolunteerTraining[0]);

                fetchPathwayNames(trainingData.associatedPathways);
              })
              .catch(() => {
                console.log("Failed to get volunteer data");
              });
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
        fetchPathwayNames(location.state.training.associatedPathways);
      }
      if (location.state.volunteerTraining) {
        setVolunteerTraining(location.state.volunteerTraining);
      }
      setLoading(false);
    }
  }, [trainingId, location.state, auth.loading, auth.id]);

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
      return <></>;
    } else if (
      volunteerTraining.trainingID !== "" &&
      volunteerTraining.numCompletedResources ===
        volunteerTraining.numTotalResources
    ) {
      // Training completed
      return (
        <>
          <div className={`${styles.marker} ${styles.trainingMarker}`}>
            TRAINING
          </div>
          <div className={`${styles.marker} ${styles.progressMarker}`}>
            COMPLETED
          </div>
        </>
      );
    }
    // Training in progress
    else
      return (
        <>
          <div className={`${styles.marker} ${styles.trainingMarker}`}>
            TRAINING
          </div>
          <div className={`${styles.marker} ${styles.progressMarker}`}>
            IN PROGRESS
          </div>
        </>
      );
  };

  const renderButton = () => {
    if (volunteerTraining.trainingID === "") {
      return (
        <Button
          sx={{ ...forestGreenButton }}
          variant="contained"
          onClick={() => {
            // Call addVolunteerTraining and wait for the result
            addVolunteerTraining(auth.id.toString(), training)
              .then(() => {
                // Retrieve the volunteer data after adding the training
                return getVolunteer(auth.id.toString());
              })
              .then((volunteerData) => {
                // Extract the relevant volunteerTraining information
                const updatedVolunteerTraining =
                  volunteerData.trainingInformation.find(
                    (trainingInfo) => trainingInfo.trainingID === training.id
                  );

                // If updatedVolunteerTraining is found, use it to set volunteerTraining
                if (updatedVolunteerTraining) {
                  setVolunteerTraining(updatedVolunteerTraining);
                  // Navigate to the training resources page after successful addition
                  navigate(`/trainings/resources`, {
                    state: {
                      training: training,
                      volunteerTraining: updatedVolunteerTraining,
                      volunteerId: auth.id.toString(),
                      fromApp: true,
                    },
                  });
                } else {
                  throw new Error("Couldn't find updatedVolunteerTraining");
                }
              })
              .catch((error) => {
                console.error(
                  "Error adding volunteer training or retrieving volunteer data:",
                  error
                );
              });
          }}>
          Start
        </Button>
      );
    } else if (volunteerTraining.progress == "COMPLETED") {
      return (
        <Button
          sx={{ ...forestGreenButton }}
          variant="contained"
          onClick={() =>
            navigate(`/trainings/resources`, {
              state: {
                training: training,
                volunteerTraining: volunteerTraining,
                volunteerId: auth.id.toString(),
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
            navigate(`/trainings/resources`, {
              state: {
                training: training,
                volunteerTraining: volunteerTraining,
                volunteerId: auth.id.toString(),
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
          <>
            {/* Hamburger Menu */}
            {!navigationBarOpen && (
              <img
                src={hamburger}
                alt="Hamburger Menu"
                className={styles.hamburger} // Add styles to position it
                width={30}
                onClick={() => setNavigationBarOpen(true)} // Set sidebar open when clicked
              />
            )}

            <div className={styles.outerContainer}>
              <div className={styles.content}>
                {/* HEADER */}
                <div className={styles.header}>
                  <h1 className={styles.nameHeading}>{training.name}</h1>
                  <ProfileIcon />
                </div>

                <div className={styles.progressContainer}>{renderMarker()}</div>

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
                        volunteerTraining.progress === "COMPLETED"
                          ? styles.opacityContainer
                          : ""
                      }`}>
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

                {/* RELATED PATHWAYS */}
                {pathwayNames.length > 0 && (
                  <>
                    <div className={styles.container}>
                      <h2>Related Pathways</h2>
                    </div>

                    <div className={styles.relatedPathways}>
                      {pathwayNames.map((pathway, idx) => (
                        <div
                          className={`${styles.marker} ${styles.pathwayMarker}`}
                          onClick={() => {
                            navigate(`/pathways/${pathway.id}`);
                          }}
                          key={idx}>
                          {pathway.name}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* footer */}
        <div
          className={styles.footer}
          style={{ width: navigationBarOpen ? "calc(100% - 250px)" : "100%" }}>
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

export default TrainingLandingPage;

import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import {
  getVolunteer,
  getAllPublishedTrainings,
  getAllPublishedPathways,
} from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType";
import { VolunteerPathway, VolunteerTraining } from "../../types/UserType";
import { Button } from "@mui/material";
import { forestGreenButtonPadding } from "../../muiTheme";
import VolunteerTrainingCard from "../../components/VolunteerTrainingCard/VolunteerTrainingCard";
import VolunteerPathwayCard from "../../components/VolunteerPathwayCard/VolunteerPathwayCard";
import styles from "./VolunteerDashboardPage.module.css";
import Certificate from "../../components/CertificateCard/CertificateCard";
import Badge from "../../components/BadgeCard/BadgeCard";
import VolunteerNavigationBar from "../../components/VolunteerNavigationBar/VolunteerNavigationBar";
import Loading from "../../components/LoadingScreen/Loading";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";
import hamburger from "../../assets/hamburger.svg";

interface CorrelatedTraining {
  genericTraining: TrainingID;
  volunteerTraining?: VolunteerTraining;
}

interface CorrelatedPathway {
  genericPathway: PathwayID;
  volunteerPathway?: VolunteerPathway;
}

function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // for pathways and trainings, track All, In progress, and Completed
  const [trainingsInProgress, setTrainingsInProgress] = useState<
    CorrelatedTraining[]
  >([]);
  const [trainingsCompleted, setTrainingsCompleted] = useState<
    CorrelatedTraining[]
  >([]);
  const [pathwaysInProgress, setPathwaysInProgress] = useState<
    CorrelatedPathway[]
  >([]);
  const [pathwaysCompleted, setPathwaysCompleted] = useState<
    CorrelatedPathway[]
  >([]);

  // Define state variables for recommended trainings and pathways
  const [recommendedTrainings, setRecommendedTrainings] = useState<
    TrainingID[]
  >([]);
  const [recommendedPathways, setRecommendedPathways] = useState<PathwayID[]>(
    []
  );

  // match up the allGenericTrainings and volunteerTrainings, use setCorrelatedTrainings to set
  // keep track of trainings in progress and trainings completed
  const correlateTrainings = (
    genericTrainings: TrainingID[],
    volunteerTrainings: VolunteerTraining[]
  ): CorrelatedTraining[][] => {
    const trainingsIP: CorrelatedTraining[] = [];
    let trainingsC: CorrelatedTraining[] = [];

    for (const genericTraining of genericTrainings) {
      // if genericTraining in volunteer.trainingInformation (has been started by volunteer), then we include that.
      for (const volunteerTraining of volunteerTrainings) {
        if (genericTraining.id == volunteerTraining.trainingID) {
          if (volunteerTraining.progress == "INPROGRESS") {
            trainingsIP.push({
              genericTraining: genericTraining,
              volunteerTraining: volunteerTraining,
            });
          } else if (volunteerTraining.progress == "COMPLETED") {
            trainingsC.push({
              genericTraining: genericTraining,
              volunteerTraining: volunteerTraining,
            });
          }
        }
      }
    }
    trainingsC = sortTrainingsByDateCompleted(trainingsC);
    setTrainingsInProgress(trainingsIP);
    setTrainingsCompleted(trainingsC);
    return [trainingsIP, trainingsC];
  };

  const correlatePathways = (
    genericPathways: PathwayID[],
    volunteerPathways: VolunteerPathway[]
  ): CorrelatedPathway[][] => {
    // match up the genericPathways and volunteerPathways
    const pathwaysIP: CorrelatedPathway[] = [];
    let pathwaysC: CorrelatedPathway[] = [];

    for (const genericPathway of genericPathways) {
      for (const volunteerPathway of volunteerPathways) {
        if (genericPathway.id == volunteerPathway.pathwayID) {
          if (volunteerPathway.progress == "INPROGRESS") {
            pathwaysIP.push({
              genericPathway: genericPathway,
              volunteerPathway: volunteerPathway,
            });
          } else if (volunteerPathway.progress == "COMPLETED") {
            pathwaysC.push({
              genericPathway: genericPathway,
              volunteerPathway: volunteerPathway,
            });
          }
        }
      }
    }
    pathwaysC = sortPathwaysByDateCompleted(pathwaysC);
    setPathwaysInProgress(pathwaysIP);
    setPathwaysCompleted(pathwaysC);
    return [pathwaysIP, pathwaysC];
  };

  // sort by reverse date completed. puts most recently completed first.
  function sortTrainingsByDateCompleted(
    trainings: CorrelatedTraining[]
  ): CorrelatedTraining[] {
    return trainings.sort((a, b) => {
      const dateA = new Date(a.volunteerTraining!.dateCompleted);
      const dateB = new Date(b.volunteerTraining!.dateCompleted);
      return dateB.getTime() - dateA.getTime();
    });
  }

  function sortPathwaysByDateCompleted(
    pathways: CorrelatedPathway[]
  ): CorrelatedPathway[] {
    return pathways.sort((a, b) => {
      const dateA = new Date(a.volunteerPathway!.dateCompleted);
      const dateB = new Date(b.volunteerPathway!.dateCompleted);
      return dateB.getTime() - dateA.getTime();
    });
  }

  function displayPathwayItems(
    itemType: string,
    pathwayList: CorrelatedPathway[]
  ): CorrelatedPathway[] {
    if (screenWidth < 450) {
      if (itemType === "card") {
        return pathwayList.slice(0, 1);
      } else {
        return pathwayList.slice(0, 2);
      }
    } else if (screenWidth > 1500) {
      if (itemType === "card") {
        return pathwayList.slice(0, 2);
      } else {
        return pathwayList.slice(0, 5);
      }
    } else if (screenWidth > 1000) {
      if (itemType === "card") {
        return pathwayList.slice(0, 2);
      } else {
        return pathwayList.slice(0, 4);
      }
    }
    if (itemType === "card") {
      return pathwayList.slice(0, 1);
    } else {
      return pathwayList.slice(0, 2);
    }
  }

  function displayTrainingItems(
    itemType: string,
    trainingList: CorrelatedTraining[]
  ): CorrelatedTraining[] {
    if (screenWidth < 450) {
      if (itemType === "card") {
        return trainingList.slice(0, 1);
      } else {
        return trainingList.slice(0, 1);
      }
    } else if (screenWidth < 750) {
      if (itemType === "card") {
        return trainingList.slice(0, 1);
      } else {
        return trainingList.slice(0, 2);
      }
    } else if (screenWidth > 1500) {
      if (itemType === "card") {
        return trainingList.slice(0, 4);
      } else {
        return trainingList.slice(0, 5);
      }
    } else if (screenWidth > 1000) {
      if (itemType === "card") {
        return trainingList.slice(0, 3);
      } else {
        return trainingList.slice(0, 4);
      }
    }
    if (itemType === "card") {
      return trainingList.slice(0, 2);
    } else {
      return trainingList.slice(0, 2);
    }
  }

  function displayPathwayCard(pathwayList: PathwayID[]): PathwayID[] {
    if (screenWidth < 450) {
      return pathwayList.slice(0, 1);
    } else if (screenWidth > 1500) {
      return pathwayList.slice(0, 2);
    } else if (screenWidth > 1000) {
      return pathwayList.slice(0, 2);
    }
    return pathwayList.slice(0, 1);
  }

  function displayTrainingCard(trainingList: TrainingID[]): TrainingID[] {
    if (screenWidth < 450) {
      return trainingList.slice(0, 1);
    } else if (screenWidth < 750) {
      return trainingList.slice(0, 1);
    } else if (screenWidth > 1500) {
      return trainingList.slice(0, 4);
    } else if (screenWidth > 1000) {
      return trainingList.slice(0, 3);
    }
    return trainingList.slice(0, 1);
  }

  useEffect(() => {
    setLoading(true);
    // only use auth if it is finished loading
    if (!auth.loading && auth.id) {
      let trainingsIP: CorrelatedTraining[] = [];
      let trainingsC: CorrelatedTraining[] = [];
      let pathwaysIP: CorrelatedPathway[] = [];
      let pathwaysC: CorrelatedPathway[] = [];
      // get volunteer info from firebase. will contain volunteer progress on trainings & pathways
      getVolunteer(auth.id.toString())
        .then((volunteer) => {
          const volunteerTrainings = volunteer.trainingInformation;
          const volunteerPathways = volunteer.pathwayInformation;

          // get all trainings from firebase
          getAllPublishedTrainings()
            .then((genericTrainings) => {
              [trainingsIP, trainingsC] = correlateTrainings(
                genericTrainings,
                volunteerTrainings
              );
            })
            .catch((error) => {
              setErrorMessage(
                "Error retrieving trainings. Please try again later."
              );
              setLoading(false);
              console.error("Error fetching trainings:", error);
            });

          // get all pathways from firebase
          getAllPublishedPathways()
            .then((genericPathways) => {
              [pathwaysIP, pathwaysC] = correlatePathways(
                genericPathways,
                volunteerPathways
              );
            })
            .catch((error) => {
              setErrorMessage(
                "Error retrieving pathways. Please try again later."
              );
              setLoading(false);
              console.error("Error fetching pathways:", error);
            });

          // Fetch all trainings and pathways
          Promise.all([getAllPublishedTrainings(), getAllPublishedPathways()])
            .then(([allTrainings, allPathways]) => {
              // Filter out trainings that user has completed or in progress
              const userCompletedTrainings = trainingsC.map(
                (training) => training.genericTraining.id
              );
              const userInProgressTrainings = trainingsIP.map(
                (training) => training.genericTraining.id
              );
              const recommendedTrainings = allTrainings.filter(
                (training) =>
                  training.status === "PUBLISHED" &&
                  !userCompletedTrainings.includes(training.id) &&
                  !userInProgressTrainings.includes(training.id)
              );

              // Filter out pathways that user has completed or in progress
              const userCompletedPathways = pathwaysC.map(
                (pathway) => pathway.genericPathway.id
              );
              const userInProgressPathways = pathwaysIP.map(
                (pathway) => pathway.genericPathway.id
              );
              const recommendedPathways = allPathways.filter(
                (pathway) =>
                  pathway.status === "PUBLISHED" &&
                  !userCompletedPathways.includes(pathway.id) &&
                  !userInProgressPathways.includes(pathway.id)
              );

              // Set recommended trainings and pathways state
              setRecommendedTrainings(recommendedTrainings);
              setRecommendedPathways(recommendedPathways);
            })
            .catch((error) => {
              setErrorMessage(
                "Error retrieving recommended trainings and pathways. Please try again later."
              );
              setLoading(false);
              console.error(
                "Error fetching recommended trainings and pathways:",
                error
              );
            });

          setLoading(false);
        })
        .catch((error) => {
          setErrorMessage("Error retrieving data. Please try again later.");
          setLoading(false);
          console.error("Error fetching volunteer:", error);
        });
    }
  }, [auth.loading, auth.id]);

  return (
    <>
      <div className={popupOpen ? styles.popupOpen : ""}>
        <VolunteerNavigationBar
          open={navigationBarOpen}
          setOpen={setNavigationBarOpen}
        />
      </div>
      <div
        className={`${styles.split} ${styles.right}`}
        style={{
          // Only apply left shift when screen width is greater than 1200px
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}
      >
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
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Hello, {auth.firstName}!</h1>
              <div className={styles.profileIcon}>
                <ProfileIcon />
              </div>
            </div>
            {loading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : errorMessage == "" ? (
              <>
                {/* Conditional rendering for no volunteer trainings and pathways */}
                {trainingsInProgress.length === 0 &&
                  pathwaysInProgress.length === 0 && (
                    <div>
                      <div className={styles.subHeader}>
                        <h2>No Trainings in Progress</h2>
                      </div>
                      <div className={styles.libraryButton}>
                        <Link to="/trainings">
                          <Button
                            sx={forestGreenButtonPadding}
                            variant="contained"
                          >
                            GO TO TRAINING LIBRARY
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                {/* display pathways in progress if there exist pathways in progress */}
                {pathwaysInProgress.length > 0 && (
                  <div>
                    <div className={styles.subHeader}>
                      <h2>Pathways in Progress</h2>
                      <Link className={styles.viewAllLink} to="/pathways">
                        VIEW ALL
                      </Link>
                    </div>
                    <div className={styles.cardsContainer}>
                      {displayPathwayItems("card", pathwaysInProgress).map(
                        (pathway, index) => (
                          <div className={styles.card} key={index}>
                            <VolunteerPathwayCard
                              pathway={pathway.genericPathway}
                              volunteerPathway={pathway.volunteerPathway}
                              preview={false}
                              setPopupOpen={setPopupOpen}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* display trainings in progress if there exist trainings in progress */}
                {trainingsInProgress.length > 0 && (
                  <div>
                    <div className={styles.subHeader}>
                      <h2>Trainings in Progress</h2>
                      <Link className={styles.viewAllLink} to="/trainings">
                        VIEW ALL
                      </Link>
                    </div>
                    <div className={styles.cardsContainer}>
                      {displayTrainingItems("card", trainingsInProgress).map(
                        (training, index) => (
                          <div className={styles.card} key={index}>
                            <VolunteerTrainingCard
                              training={training.genericTraining}
                              volunteerTraining={training.volunteerTraining}
                              preview={false}
                              setPopupOpen={setPopupOpen}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* display badges if there exist pathways completed */}
                {pathwaysCompleted.length > 0 && (
                  <div>
                    <div className={styles.subHeader}>
                      <h2>Recent Badges</h2>
                      <div
                        className={styles.viewAllLink}
                        onClick={() => {
                          navigate(`/achievements`, {
                            state: {
                              cardType: "badge",
                            },
                          });
                        }}
                      >
                        VIEW ALL
                      </div>
                    </div>
                    <div className={styles.cardsContainer}>
                      {displayPathwayItems("badge", pathwaysCompleted).map(
                        (pathway, index) => (
                          <div className={styles.card} key={index}>
                            <Badge
                              image={pathway.genericPathway.coverImage}
                              title={pathway.genericPathway.name}
                              date={pathway.volunteerPathway!.dateCompleted}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* display certifications if there exist trainings completed */}
                {trainingsCompleted.length > 0 && (
                  <div>
                    <div className={styles.subHeader}>
                      <h2>Recent Certifications</h2>
                      <div
                        className={styles.viewAllLink}
                        onClick={() => {
                          navigate(`/achievements`, {
                            state: {
                              cardType: "certification",
                            },
                          });
                        }}
                      >
                        VIEW ALL
                      </div>
                    </div>
                    <div className={styles.cardsContainer}>
                      {displayTrainingItems(
                        "certificate",
                        trainingsCompleted
                      ).map((training, index) => (
                        <div className={styles.card} key={index}>
                          <Certificate
                            image={training.genericTraining.coverImage}
                            title={training.genericTraining.name}
                            date={training.volunteerTraining!.dateCompleted}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render Recommended Trainings */}
                {recommendedTrainings.length > 0 &&
                  trainingsInProgress.length === 0 && (
                    <div>
                      <div className={styles.subHeader}>
                        <h2>Recommended Trainings</h2>
                        <Link className={styles.viewAllLink} to="/trainings">
                          VIEW ALL
                        </Link>
                      </div>
                      <div className={styles.cardsContainer}>
                        {displayTrainingCard(recommendedTrainings).map(
                          (training, index) => (
                            <div className={styles.card} key={index}>
                              <VolunteerTrainingCard
                                training={training}
                                preview={false}
                                setPopupOpen={setPopupOpen}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Render Recommended Pathways */}
                {recommendedPathways.length > 0 &&
                  pathwaysInProgress.length === 0 && (
                    <div>
                      <div className={styles.subHeader}>
                        <h2>Recommended Pathways</h2>
                        <Link className={styles.viewAllLink} to="/pathways">
                          VIEW ALL
                        </Link>
                      </div>
                      <div className={styles.cardsContainer}>
                        {displayPathwayCard(recommendedPathways).map(
                          (pathway, index) => (
                            <div className={styles.card} key={index}>
                              <VolunteerPathwayCard
                                pathway={pathway}
                                preview={false}
                                setPopupOpen={setPopupOpen}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </>
            ) : (
              <h2 className={styles.errorMessage}>{errorMessage}</h2>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Dashboard;

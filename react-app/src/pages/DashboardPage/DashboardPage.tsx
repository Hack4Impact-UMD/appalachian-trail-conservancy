import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Link } from "react-router-dom";
import {
  getVolunteer,
  getAllTrainings,
  getAllPathways,
} from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType";
import { VolunteerPathway, VolunteerTraining } from "../../types/UserType";
import { Button } from "@mui/material";
import { forestGreenButtonPadding } from "../../muiTheme";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import PathwayCard from "../../components/PathwayCard/PathwayCard";
import styles from "./DashboardPage.module.css";
import Certificate from "../../components/CertificateCard/CertificateCard";
import Badge from "../../components/BadgeCard/BadgeCard";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Loading from "../../components/LoadingScreen/Loading";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);

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
  ) => {
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
  };

  const correlatePathways = (
    genericPathways: PathwayID[],
    volunteerPathways: VolunteerPathway[]
  ) => {
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

  useEffect(() => {
    // only use auth if it is finished loading
    if (!auth.loading && auth.id) {
      // get volunteer info from firebase. will contain volunteer progress on trainings & pathways
      getVolunteer(auth.id.toString())
        .then((volunteer) => {
          const volunteerTrainings = volunteer.trainingInformation;
          const volunteerPathways = volunteer.pathwayInformation;

          // get all trainings from firebase
          getAllTrainings()
            .then((genericTrainings) => {
              correlateTrainings(genericTrainings, volunteerTrainings);
            })
            .catch((error) => {
              console.error("Error fetching trainings:", error);
            });

          // get all pathways from firebase
          getAllPathways()
            .then((genericPathways) => {
              correlatePathways(genericPathways, volunteerPathways);
            })
            .catch((error) => {
              console.error("Error fetching pathways:", error);
            });

          // Fetch all trainings and pathways
          Promise.all([getAllTrainings(), getAllPathways()])
            .then(([allTrainings, allPathways]) => {
              // Filter out trainings that user has completed or in progress
              const userCompletedTrainings = trainingsCompleted.map(
                (training) => training.genericTraining.id
              );
              const userInProgressTrainings = trainingsInProgress.map(
                (training) => training.genericTraining.id
              );
              const recommendedTrainings = allTrainings.filter(
                (training) =>
                  !userCompletedTrainings.includes(training.id) &&
                  !userInProgressTrainings.includes(training.id)
              );

              // Filter out pathways that user has completed or in progress
              const userCompletedPathways = pathwaysCompleted.map(
                (pathway) => pathway.genericPathway.id
              );
              const userInProgressPathways = pathwaysInProgress.map(
                (pathway) => pathway.genericPathway.id
              );
              const recommendedPathways = allPathways.filter(
                (pathway) =>
                  !userCompletedPathways.includes(pathway.id) &&
                  !userInProgressPathways.includes(pathway.id)
              );

              // Set recommended trainings and pathways state
              setRecommendedTrainings(recommendedTrainings);
              setRecommendedPathways(recommendedPathways);
            })
            .catch((error) => {
              console.error(
                "Error fetching recommended trainings and pathways:",
                error
              );
            });

          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching volunteer:", error);
        });
    }
  }, [auth.loading, auth.id]);

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />

      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}>
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Hello, {auth.firstName}!</h1>
              <ProfileIcon />
            </div>
            {loading ? (
              <Loading />
            ) : (
              <>
                {/* Conditional rendering for no volunteer trainings and pathways */}
                {trainingsInProgress.length === 0 &&
                  pathwaysInProgress.length === 0 && (
                    <div>
                      <div className={styles.subHeader}>
                        <h2>No Trainings in Progress</h2>
                      </div>
                      <Link to="/trainings">
                        <Button
                          sx={forestGreenButtonPadding}
                          variant="contained">
                          GO TO TRAINING LIBRARY
                        </Button>
                      </Link>
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
                      {pathwaysInProgress.slice(0, 2).map((pathway, index) => (
                        <div className={styles.card} key={index}>
                          <PathwayCard
                            pathway={pathway.genericPathway}
                            volunteerPathway={pathway.volunteerPathway}
                          />
                        </div>
                      ))}
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
                      {trainingsInProgress
                        .slice(0, 3)
                        .map((training, index) => (
                          <div className={styles.card} key={index}>
                            <TrainingCard
                              training={training.genericTraining}
                              volunteerTraining={training.volunteerTraining}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* display badges if there exist pathways completed */}
                {pathwaysCompleted.length > 0 && (
                  <div>
                    <div className={styles.subHeader}>
                      <h2>Recent Badges</h2>
                      <Link className={styles.viewAllLink} to="/achievements">
                        VIEW ALL
                      </Link>
                    </div>
                    <div className={styles.cardsContainer}>
                      {pathwaysCompleted.slice(0, 4).map((pathway, index) => (
                        <div className={styles.card} key={index}>
                          <Badge
                            image={pathway.genericPathway.badgeImage}
                            title={pathway.genericPathway.name}
                            date={pathway.volunteerPathway!.dateCompleted}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* display certifications if there exist trainings completed */}
                {trainingsCompleted.length > 0 && (
                  <div>
                    <div className={styles.subHeader}>
                      <h2>Recent Certifications</h2>
                      <Link className={styles.viewAllLink} to="/achievements">
                        VIEW ALL
                      </Link>
                    </div>
                    <div className={styles.cardsContainer}>
                      {trainingsCompleted.slice(0, 4).map((training, index) => (
                        <div className={styles.card} key={index}>
                          <Certificate
                            image={training.genericTraining.certificationImage}
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
                        {recommendedTrainings
                          .slice(0, 3)
                          .map((training, index) => (
                            <div className={styles.card} key={index}>
                              <TrainingCard training={training} />
                            </div>
                          ))}
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
                        {recommendedPathways
                          .slice(0, 2)
                          .map((pathway, index) => (
                            <div className={styles.card} key={index}>
                              <PathwayCard pathway={pathway} />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Dashboard;

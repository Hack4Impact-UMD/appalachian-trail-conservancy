import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Link } from "react-router-dom";
import { getVolunteer, getAllTrainings, getAllPathways } from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType";
import { VolunteerTraining, VolunteerPathway } from "../../types/UserType";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import PathwayCard from "../../components/PathwayCard/PathwayCard";
import styles from "./DashboardPage.module.css";
import Certificate from "../../components/CertificateCard/CertificateCard";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Loading from "../../components/LoadingScreen/Loading";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";
import badge from "../../assets/badge.svg";

function Dashboard() {
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [correlatedTrainings, setCorrelatedTrainings] = useState<
    { genericTraining: TrainingID; volunteerTraining?: VolunteerTraining }[]
  >([]);
  const [correlatedPathways, setCorrelatedPathways] = useState<
    { genericPathway: PathwayID; volunteerPathway?: VolunteerPathway }[]
  >([]);

  const pathwayCards = [
    { title: "Title 1", progress: 73 },
    { title: "Title 2" },
  ];

  const certificateCards = [
    { title: "Title 1", date: "2024-03-19" },
    { title: "Title 2", date: "2024-03-19" },
    { title: "Title 3", date: "2024-03-19" },
    { title: "Title 4", date: "2024-03-19" },
  ];

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
              
            // match up the allGenericTrainings and volunteerTrainings, use setCorrelatedTrainings to set
            let allCorrelatedTrainings: {
              genericTraining: TrainingID;
              volunteerTraining?: VolunteerTraining;
            }[] = [];
            for (const genericTraining of genericTrainings) {
              // if genericTraining in volunteer.trainingInformation (has been started by volunteer), then we include that.
              let startedByVolunteer = false;
              for (const volunteerTraining of volunteerTrainings) {
                if (genericTraining.id == volunteerTraining.trainingID) {
                  startedByVolunteer = true;
                  allCorrelatedTrainings.push({
                    genericTraining: genericTraining,
                    volunteerTraining: volunteerTraining,
                  });
                }
              }
              if (!startedByVolunteer) {
                allCorrelatedTrainings.push({
                  genericTraining: genericTraining,
                  volunteerTraining: undefined,
                });
              }
            }
            setCorrelatedTrainings(allCorrelatedTrainings);
          })
          .catch((error) => {
            console.error("Error fetching trainings:", error);
          });

          // get all pathways from firebase
          getAllPathways()
          .then((genericPathways) => {

            // match up the genericPathways and volunteerPathways
            let allCorrelatedPathways: {
              genericPathway: PathwayID;
              volunteerPathway?: VolunteerPathway;
            }[] = [];

            for (const genericPathway of genericPathways) {
              let startedByVolunteer = false;
              for (const volunteerPathway of volunteerPathways) {
                if (genericPathway.id == volunteerPathway.pathwayID) {
                  startedByVolunteer = true;
                  allCorrelatedPathways.push({
                    genericPathway: genericPathway,
                    volunteerPathway: volunteerPathway,
                  });
                }
              }
              if (!startedByVolunteer) {
                allCorrelatedPathways.push({
                  genericPathway: genericPathway,
                  volunteerPathway: undefined,
                });
              }
            }
            setCorrelatedPathways(allCorrelatedPathways);
          })
          .catch((error) => {
            console.error("Error fetching pathways:", error);
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
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
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
                <div className={styles.subHeader}>
                  <h2>Pathways in Progress</h2>
                  <Link className={styles.viewAllLink} to="/pathways">
                    VIEW ALL
                  </Link>
                </div>
                <div className={styles.cardsContainer}>
                  {correlatedPathways.map((pathway, index) => (
                    <div className={styles.card} key={index}>
                      <PathwayCard
                        image="../../"
                        title={pathway.genericPathway.name}
                        progress={pathway.volunteerPathway? 
                          pathway.volunteerPathway.numTrainingsCompleted / pathway.volunteerPathway.numTotalTrainings * 100
                          : 0}
                      />
                    </div>
                  ))}
                </div>
                <div className={styles.subHeader}>
                  <h2>Trainings in Progress</h2>
                  <Link className={styles.viewAllLink} to="/trainings">
                    VIEW ALL
                  </Link>
                </div>
                <div className={styles.cardsContainer}>
                  {correlatedTrainings.map((training, index) => (
                    <div className={styles.card} key={index}>
                      <TrainingCard
                        training={training.genericTraining}
                        volunteerTraining={training.volunteerTraining}
                      />
                    </div>
                  ))}
                </div>
                <div className={styles.subHeader}>
                  <h2>Recent Badges</h2>
                  <Link className={styles.viewAllLink} to="/achievements">
                    VIEW ALL
                  </Link>
                </div>
                <div className={styles.cardsContainer}>
                  {certificateCards.map((cert, index) => (
                    <div className={styles.card} key={index}>
                      <Certificate
                        image={badge}
                        title={cert.title}
                        date={cert.date}
                      />
                    </div>
                  ))}
                </div>
                <div className={styles.subHeader}>
                  <h2>Recent Certifications</h2>
                  <Link className={styles.viewAllLink} to="/achievements">
                    VIEW ALL
                  </Link>
                </div>
                <div className={styles.cardsContainer}>
                  {certificateCards.map((cert, index) => (
                    <div className={styles.card} key={index}>
                      <Certificate
                        image={badge}
                        title={cert.title}
                        date={cert.date}
                      />
                    </div>
                  ))}
                </div>
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

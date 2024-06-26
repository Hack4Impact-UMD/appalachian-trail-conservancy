import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Link } from "react-router-dom";
import { getVolunteer, getAllTrainings, getPathway, getAllPathways } from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { VolunteerPathway, VolunteerTraining } from "../../types/UserType";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import PathwayCard from "../../components/PathwayCard/PathwayCard";
import styles from "./DashboardPage.module.css";
import Certificate from "../../components/CertificateCard/CertificateCard";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Loading from "../../components/LoadingScreen/Loading";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";
import badge from "../../assets/badge.svg";
import { PathwayID } from "../../types/PathwayType";

function Dashboard() {
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [correlatedTrainings, setCorrelatedTrainings] = useState<
    { genericTraining: TrainingID; volunteerTraining: VolunteerTraining }[]
  >([]);
  const [correlatedPathways, setCorrelatedPathways] = useState<
    { genericPathway: PathwayID; volunteerPathway: VolunteerPathway }[]
  >([]);

  const certificateCards = [
    { title: "Title 1", date: "2024-03-19" },
    { title: "Title 2", date: "2024-03-19" },
    { title: "Title 3", date: "2024-03-19" },
    { title: "Title 4", date: "2024-03-19" },
  ];

  useEffect(() => {
    // get all trainings from firebase
    getAllTrainings()
      .then((genericTrainings) => {
        // only use auth if it is finished loading
        if (!auth.loading && auth.id) {
          // get volunteer info from firebase. will contain volunteer progress on trainings
          getVolunteer(auth.id.toString())
            .then((volunteer) => {
              const volunteerTrainings = volunteer.trainingInformation;
              // match up the allGenericTrainings and volunteerTrainings, use setCorrelatedTrainings to set
              let allCorrelatedTrainings: {
                genericTraining: TrainingID;
                volunteerTraining: VolunteerTraining;
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
              }
              setCorrelatedTrainings(allCorrelatedTrainings);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching volunteer:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching trainings:", error);
      });
  }, [auth.loading, auth.id]);

  useEffect(() => {
    // get all trainings from firebase
    getAllPathways()
      .then((genericPathways) => {
        // only use auth if it is finished loading
        if (!auth.loading && auth.id) {
          // get volunteer info from firebase. will contain volunteer progress on trainings
          getVolunteer(auth.id.toString())
            .then((volunteer) => {
              const volunteerPathways = volunteer.pathwayInformation;
              // match up the allGenericTrainings and volunteerTrainings, use setCorrelatedTrainings to set
              let allCorrelatedPathways: {
                genericPathway: PathwayID;
                volunteerPathway: VolunteerPathway;
              }[] = [];
              for (const genericPathway of genericPathways) {
                // if genericTraining in volunteer.trainingInformation (has been started by volunteer), then we include that.
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
              }
              setCorrelatedPathways(allCorrelatedPathways);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching volunteer:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching trainings:", error);
      });
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
                {correlatedPathways.map((corrPathway, index) => (
                    <div className={styles.card} key={index}>
                      <PathwayCard
                        pathway={corrPathway.genericPathway}
                        volunteerPathway={corrPathway.volunteerPathway}
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
                  {correlatedTrainings.map((corrTraining, index) => (
                    <div className={styles.card} key={index}>
                      <TrainingCard
                        training={corrTraining.genericTraining}
                        volunteerTraining={corrTraining.volunteerTraining}
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

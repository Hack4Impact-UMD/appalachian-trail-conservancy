import { useAuth } from "../../auth/AuthProvider";
import { Link } from "react-router-dom";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import PathwayCard from "../../components/PathwayCard/PathwayCard";
import styles from "./DashboardPage.module.css";
import Certificate from "../../components/CertificateCard/CertificateCard";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";
import training1 from "../../assets/training1.jpg";
import training2 from "../../assets/training2.jpg";
import training3 from "../../assets/training3.png";
import training4 from "../../assets/training4.jpg";
import badge from "../../assets/badge.svg";

function Dashboard() {
  const auth = useAuth();
  const images = [training1, training2, training3, training4];

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

  return (
    <>
      <NavigationBar />

      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Hello, {auth.firstName}!</h1>
              <ProfileIcon />
            </div>
            <div className={styles.subHeader}>
              <h2>Pathways in Progress</h2>
              <Link className={styles.viewAllLink} to="/pathways">
                VIEW ALL
              </Link>
            </div>
            <div className={styles.cardsContainer}>
              {pathwayCards.map((pathway, index) => (
                <div className={styles.card} key={index}>
                  <PathwayCard
                    image="../../"
                    title={pathway.title}
                    progress={pathway.progress}
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
              {/* {trainingCards.map((training, index) => (
                <div className={styles.card} key={index}>
                  <TrainingCard
                    image={training.image}
                    title={training.title}
                    progress={training.progress}
                  />
                </div>
              ))} */}
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
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Dashboard;

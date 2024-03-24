import TrainingCard from "../../components/TrainingCard/Training";
import styles from "./Dashboard.module.css";
import Certificate from "../../components/CertificateCard/Certificate";
import NavigationBar from "../../components/NavigationBar/NavigationBar";

import { Link } from "react-router-dom";
function Dashboard() {
  const trainingCards = [
    { title: "Title 1", subtitle: "Subtitle 1", progress: 23 },
    { title: "Title 2", subtitle: "Subtitle 2", progress: 50 },
    { title: "Title 3", subtitle: "Subtitle 3", progress: 76 },
  ];
  const certificateCards = [
    { title: "Title 1", date: "MARCH 24 2024" },
    { title: "Title 2", date: "MARCH 24 2024" },
    { title: "Title 3", date: "MARCH 24 2024" },
    { title: "Title 4", date: "MARCH 24 2024" },
  ];
  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.header}>
          <h1 className={styles.nameHeading}>Hello, Name!</h1>
          {/* PLACEHOLDER IMAGE */}
          <div className={styles.imgContainer}>
            <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
          </div>
        </div>
        <div className={styles.subHeader}>
          <h2>Pathways in Progress</h2>
          <Link className={styles.viewAllLink} to="/">
            VIEW ALL
          </Link>
        </div>
        <div className={styles.cardsContainer}>
          {trainingCards.map((training, index) => (
            <div className={styles.card} key={index}>
              <TrainingCard
                image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
                title={training.title}
                subtitle={training.subtitle}
                progress={training.progress}
              />
            </div>
          ))}
        </div>
        <div className={styles.subHeader}>
          <h2>Trainings in Progress</h2>
          <Link className={styles.viewAllLink} to="/trainingsInProgress">
            VIEW ALL
          </Link>
        </div>
        <div className={styles.cardsContainer}>
          {trainingCards.map((training, index) => (
            <div className={styles.card} key={index}>
              <TrainingCard
                image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
                title={training.title}
                subtitle={training.subtitle}
                progress={training.progress}
              />
            </div>
          ))}
        </div>
        <div className={styles.subHeader}>
          <h2>Recent Badges</h2>
          <Link className={styles.viewAllLink} to="/">
            VIEW ALL
          </Link>
        </div>
        <div className={styles.cardsContainer}>
          {certificateCards.map((cert, index) => (
            <div className={styles.card} key={index}>
              <Certificate
                image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
                title={cert.title}
                date={cert.date}
              />
            </div>
          ))}
        </div>
        <div className={styles.subHeader}>
          <h2>Recent Certifications</h2>
          <Link className={styles.viewAllLink} to="/trainingsCompleted">
            VIEW ALL
          </Link>
        </div>
        <div className={styles.cardsContainer}>
          {certificateCards.map((cert, index) => (
            <div className={styles.card} key={index}>
              <Certificate
                image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
                title={cert.title}
                date={cert.date}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;

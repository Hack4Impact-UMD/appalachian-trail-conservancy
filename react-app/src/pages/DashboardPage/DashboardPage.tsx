import { useState } from "react";
import { Link } from "react-router-dom";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import PathwayCard from "../../components/PathwayCard/PathwayCard";
import styles from "./Dashboard.module.css";
import Certificate from "../../components/CertificateCard/Certificate";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import TrainingPopup from "../../components/TrainingPopup/TrainingPopup";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

function Dashboard() {
  const [openTrainingPopup, setOpenTrainingPopup] = useState<boolean>(false);
  const pathwayCards = [
    { title: "Title 1", progress: 73 },
    { title: "Title 2" },
  ];
  const trainingCards = [
    {
      title: "Title 1",
      progress: 100,
    },
    { title: "Title 2" },
    {
      title: "Title 3",
      progress: 76,
    },
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
          <ProfileIcon />
        </div>
        <div className={styles.subHeader}>
          <h2>Pathways in Progress</h2>
          <Link className={styles.viewAllLink} to="/pathways">
            VIEW ALL
          </Link>
        </div>
        <TrainingPopup
          open={openTrainingPopup}
          onClose={setOpenTrainingPopup}
          image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
        />
        <div className={styles.cardsContainer}>
          {pathwayCards.map((pathway, index) => (
            <div className={styles.card} key={index}>
              <PathwayCard
                image="https://i.pinimg.com/originals/a6/d5/de/a6d5de69b1e7d0f02992965ed5052985.jpg"
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
          {trainingCards.map((training, index) => (
            <div className={styles.card} key={index}>
              <TrainingCard
                image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
                title={training.title}
                progress={training.progress}
                setOpenTrainingPopup={setOpenTrainingPopup}
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
                image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
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

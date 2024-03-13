import { useState } from "react";
import TrainingCard from "../../components/TrainingCard/Training";
import styles from "./Dashboard.module.css";
import Certificate from "../../components/CertificateCard/Certificate";
import TrainingPopup from "../../components/TrainingPopup/TrainingPopup";

import { Link } from "react-router-dom";

function Dashboard() {
  const [openTrainingPopup, setOpenTrainingPopup] = useState<boolean>(false);

  return (
    <>
      <div className={`${styles.split} ${styles.left}`}></div>
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.header}>
          <h1 className={styles.nameHeading}>Hello, Name!</h1>
          {/* PLACEHOLDER IMAGE */}
          <div className={styles.imgContainer}>
            <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
          </div>
        </div>
        <div className={styles.subHeader}>
          <h2>Trainings in Progress</h2>
          <Link className={styles.viewAllLink} to="/trainingsInProgress">
            VIEW ALL
          </Link>
        </div>
        <TrainingPopup
          open={openTrainingPopup}
          onClose={setOpenTrainingPopup}
          image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
        />
        <div className={styles.cardsContainer}>
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="SUBTITLE"
            progress={23}
            setOpenTrainingPopup={setOpenTrainingPopup}
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="SUBTITLE"
            progress={62}
            setOpenTrainingPopup={setOpenTrainingPopup}
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="SUBTITLE"
            progress={50}
            setOpenTrainingPopup={setOpenTrainingPopup}
          />
        </div>
        <div className={styles.subHeader}>
          <h2>Certifications</h2>
          <Link className={styles.viewAllLink} to="/trainingsCompleted">
            VIEW ALL
          </Link>
        </div>
        <div className={styles.cardsContainer}>
          <Certificate
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            date="FEBRUARY 26, 2024"
          />
          <Certificate
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            date="FEBRUARY 26, 2024"
          />
          <Certificate
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            date="FEBRUARY 26, 2024"
          />
          <Certificate
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            date="FEBRUARY 26, 2024"
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;

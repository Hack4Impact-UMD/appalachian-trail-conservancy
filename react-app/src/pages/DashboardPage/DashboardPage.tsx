import TrainingCard from "../../components/TrainingCard/Training";
import styles from "./Dashboard.module.css";
import Certificate from "../../components/CertificateCard/Certificate";

import { Link } from "react-router-dom";
function Dashboard() {
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
        <div className={styles.cardsContainer}>
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="Subtitle"
            progress={23}
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="Subtitle"
            progress={23}
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="Subtitle"
            progress={23}
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
            title="Certificate Title"
            date="FEBRUARY 26, 2024"
          />
          <Certificate
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Certificate Title"
            date="FEBRUARY 26, 2024"
          />
          <Certificate
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Certificate Title"
            date="FEBRUARY 26, 2024"
          />
          <Certificate
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Certificate Title"
            date="FEBRUARY 26, 2024"
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;

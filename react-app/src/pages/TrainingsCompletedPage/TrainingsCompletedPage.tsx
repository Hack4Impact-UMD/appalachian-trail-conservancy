import Certificate from "../../components/CertificateCard/Certificate.tsx";
import TrainingCard from "../../components/TrainingCard/TrainingCard.tsx";
import styles from "./TrainingsCompletedPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar.tsx";

const TrainingsCompletedPage = () => {
  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.header}>
          <h1 className={styles.nameHeading}>Trainings Completed</h1>
          {/* PLACEHOLDER IMAGE */}
          <div className={styles.imgContainer}>
            <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
          </div>
        </div>
        <div className={styles.subHeader}>
          <h2>Certifications</h2>
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
        <div className={styles.subHeader}>
          <h2> Recommended </h2>
        </div>
        <div className={styles.cardsContainer}>
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Another Training Task"
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Another Training Task"
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Another Training Task"
          />
        </div>
      </div>
    </>
  );
};

export default TrainingsCompletedPage;

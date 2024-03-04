import styles from "./TrainingsInProgressPage.module.css";
import TrainingCard from "../../components/TrainingCard/Training.tsx";

function TrainingsInProgressPage() {
  return (
    <>
      <div className={`${styles.split} ${styles.left}`}></div>
      <div className={`${styles.split} ${styles.right}`}>
      <div className={styles.header}>
        <h1 className={styles.nameHeading}>Trainings in Progress</h1>
        {/* PLACEHOLDER IMAGE */}
        <div className={styles.imgContainer}>
          <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
        </div>
      </div>
        <div className={styles.cardsContainer}>
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="SUBTITLE"
            progress={23}
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="SUBTITLE"
            progress={7}
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="SUBTITLE"
            progress={99}
          />
        </div>
        <div className={styles.subHeader}>
          <h2>Recommended</h2>
        </div>
        <div className={styles.cardsContainer}>
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="SUBTITLE"
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="SUBTITLE"
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="SUBTITLE"
          />
        </div>
      </div>
    </>
  );
}

export default TrainingsInProgressPage;

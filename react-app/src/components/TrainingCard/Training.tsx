import React from "react";
import LinearProgressWithLabel from "./LinearProgressWithLabel";

import styles from "./Training.module.css";

interface TrainingCardProps {
  image: string;
  title: string;
  subtitle: string;
  progress?: number; // Optional progress value
  setOpenTrainingPopup?: any; // Optional close popup function
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  image,
  title,
  subtitle,
  progress,
  setOpenTrainingPopup,
}) => {
  return (
    <div
      className={styles["trainingCard"]}
      onClick={() => setOpenTrainingPopup(true)}
    >
      <div className={styles["trainingImage"]}>
        <img src={image} alt="Training Task" />
      </div>
      <div className={styles["trainingContent"]}>
        <div className={styles["trainingDetails"]}>
          <h2 className={styles["trainingTitle"]}>{title}</h2>
          <p className={styles["trainingSubtitle"]}>{subtitle}</p>
        </div>
        {progress !== undefined && (
          <div className={styles["progressBar"]}>
            <LinearProgressWithLabel value={progress} />
          </div>
        )}
        {progress == undefined && (
          <div className={styles["emptyProgressBarContainer"]} />
        )}
      </div>
    </div>
  );
};

export default TrainingCard;

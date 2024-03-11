import React from "react";
import LinearProgressWithLabel from "./LinearProgressWithLabel";

import styles from "./Training.module.css";

interface TrainingCardProps {
  image: string;
  title: string;
  subtitle: string;
  progress?: number; // Optional progress value
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  image,
  title,
  subtitle,
  progress,
}) => {
  return (
    <a href="/trainingPage" className={styles["linking"]}>
      <div className={styles["trainingCard"]}>
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
    </a>
  );
};

export default TrainingCard;

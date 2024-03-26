import React from "react";
import LinearProgressWithLabel from "../LinearProgressWithLabel/LinearProgressWithLabel";
import styles from "./TrainingCard.module.css";

interface TrainingCardProps {
  image: string;
  title: string;
  progress?: number; // Optional progress value
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  image,
  title,
  progress,
}) => {
  const renderMarker = () => {
    if (progress === undefined) {
      // Training not started
      return (
        <div className={`${styles.marker} ${styles.notStartedMarker}`}>
          NOT STARTED
        </div>
      );
    } else if (progress === 100) {
      // Training completed
      return (
        <div className={`${styles.marker} ${styles.completedMarker}`}>
          COMPLETED
        </div>
      );
    } else {
      // Training in progress
      return <LinearProgressWithLabel value={progress} />;
    }
  };

  return (
    <div className={styles.trainingCard}>
      <div className={styles.trainingImage}>
        <img src={image} alt="Training" />
      </div>
      <div className={styles.trainingContent}>
        <div className={styles.trainingTitle}>{title}</div>
        <div className={styles.progressBar}>{renderMarker()}</div>
      </div>
    </div>
  );
};

export default TrainingCard;

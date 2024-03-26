import React from "react";
import LinearProgressWithLabel from "../LinearProgressWithLabel/LinearProgressWithLabel";
import styles from "./Pathway.module.css";

interface PathwayCardProps {
  image: string;
  title: string;
  progress?: number; // Optional progress value
}

const PathwayCard: React.FC<PathwayCardProps> = ({
  image,
  title,
  progress,
}) => {
  const renderMarker = () => {
    if (progress === undefined) {
      // Pathway not started
      return (
        <div className={`${styles.marker} ${styles.notStartedMarker}`}>
          NOT STARTED
        </div>
      );
    } else if (progress === 100) {
      // Pathway completed
      return (
        <div className={`${styles.marker} ${styles.completedMarker}`}>
          COMPLETED
        </div>
      );
    } else {
      // Pathway in progress
      return <LinearProgressWithLabel value={progress} />;
    }
  };

  return (
    <div className={styles.pathwayCard}>
      <div className={styles.pathwayImage}>
        <img src={image} alt="Pathway" />
      </div>
      <div className={styles.pathwayContent}>
        <div className={styles.pathwayTitle}>{title}</div>
        <div className={styles.progressBar}>{renderMarker()}</div>
      </div>
    </div>
  );
};

export default PathwayCard;

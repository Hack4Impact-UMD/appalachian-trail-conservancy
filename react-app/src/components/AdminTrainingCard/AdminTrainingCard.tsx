import styles from "./AdminTrainingCard.module.css";
import { TrainingID } from "../../types/TrainingType";

interface AdminTrainingCardProps {
  training: TrainingID;
}

const AdminTrainingCard: React.FC<AdminTrainingCardProps> = ({ training }) => {
  return (
    <>
      <div className={styles.trainingCard}>
        <div className={styles.trainingImage}>
          <img src={training.coverImage} alt="Training" />
        </div>
        <div className={styles.trainingContent}>
          <div className={styles.trainingTitleWrapper}>
            <div className={styles.trainingTitle}>
              {training.name.substring(0, 20)}
              {training.name.length > 20 ? "..." : ""}
            </div>
            {training.name.length > 20 && (
              <span className={styles.tooltip}>{training.name}</span>
            )}
          </div>
          <div className={styles.outsideMarker}>
            <div className={`${styles.marker}`}>EDIT</div>
            <div className={styles.markerStatus}>{training.status}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTrainingCard;

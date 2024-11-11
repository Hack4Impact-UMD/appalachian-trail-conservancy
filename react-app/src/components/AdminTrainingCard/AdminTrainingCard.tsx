import styles from "./AdminTrainingCard.module.css";
import { TrainingID } from "../../types/TrainingType";

interface AdminTrainingCardProps {
  training: TrainingID;
  onEdit: () => void;
}

const AdminTrainingCard: React.FC<AdminTrainingCardProps> = ({ training, onEdit }) => {
  return (
    <>
      <div className={styles.trainingCard}>
        <div className={styles.trainingImage}>
          <img src={training.coverImage} alt="Training" />
        </div>
        <div className={styles.trainingContent}>
          <div className={styles.trainingTitle}>
            {training.name.substring(0, 20)}
            {training.name.length >= 21 ? "..." : ""}
          </div>
          <div className={styles.outsideMarker} onClick={onEdit}>
            <div className={`${styles.marker}`}>EDIT</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTrainingCard;

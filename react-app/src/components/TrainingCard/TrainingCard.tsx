import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TrainingCard.module.css";
import PathwayTrainingPopup from "../PathwayTrainingPopup/PathwayTrainingPopup";
import { TrainingID } from "../../types/TrainingType";
import { VolunteerTraining } from "../../types/UserType";

interface TrainingCardProps {
  training: TrainingID;
  volunteerTraining?: VolunteerTraining;
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  training,
  volunteerTraining,
}) => {
  const [openTrainingPopup, setOpenTrainingPopup] = useState<boolean>(false);
  const navigate = useNavigate();

  const renderMarker = () => {
    if (volunteerTraining == undefined) {
      // Training not started
      return <div className={styles.marker}></div>;
    } else if (volunteerTraining.progress === "COMPLETED") {
      // Training completed
      return (
        <div className={`${styles.marker} ${styles.completedMarker}`}>
          COMPLETED
        </div>
      );
    } else {
      // Training in progress
      return (
        <div className={`${styles.marker} ${styles.notStartedMarker}`}>
          IN PROGRESS
        </div>
      );
    }
  };

  return (
    <>
      <div
        className={styles.trainingCard}
        onClick={() => {
          if (volunteerTraining == undefined) {
            setOpenTrainingPopup(true);
          } else {
            // Navigate to training landing page with training and volunteerTraining as state
            navigate(`/trainings/${training.id}`, {
              state: {
                training: training,
                volunteerTraining: volunteerTraining,
              },
            });
          }
        }}
      >
        <div className={styles.trainingImage}>
          <img src={training.coverImage} alt="Training" />
        </div>
        <div className={styles.trainingContent}>
          <div className={styles.trainingTitleWrapper}>
            <div className={styles.trainingTitle}>
              {training.name.substring(0, 31)}
              {training.name.length > 30 ? "..." : ""}
            </div>
            {training.name.length > 30 && (
              <span className={styles.tooltip}>{training.name}</span>
            )}
          </div>
          <div className={styles.progressBar}>{renderMarker()}</div>
        </div>
      </div>
      <PathwayTrainingPopup
        open={openTrainingPopup}
        onClose={setOpenTrainingPopup}
        record={training}
        volunteerRecord={volunteerTraining}
        mode={"training"}
      />
    </>
  );
};

export default TrainingCard;

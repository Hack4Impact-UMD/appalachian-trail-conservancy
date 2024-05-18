import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TrainingCard.module.css";
import LinearProgressWithLabel from "../LinearProgressWithLabel/LinearProgressWithLabel";
import TrainingPopup from "../TrainingPopup/TrainingPopup";
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
    } else if (
      volunteerTraining.numCompletedResources ===
      volunteerTraining.numTotalResources
    ) {
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
            // TODO: Navigate to training landing page and pass Training and VolunteerTraining as state
            navigate(`/trainings/:${training.id}`, {
              state: {
                training: training,
                volunteerTraining: volunteerTraining,
              },
            });
          }
        }}>
        <div className={styles.trainingImage}>
          <img src={training.coverImage} alt="Training" />
        </div>
        <div className={styles.trainingContent}>
          <div className={styles.trainingTitle}>
            {training.name.substring(0, 31)}
            {training.name.length > 30 ? "..." : ""}
          </div>
          <div className={styles.progressBar}>{renderMarker()}</div>
        </div>
      </div>
      <TrainingPopup
        open={openTrainingPopup}
        onClose={setOpenTrainingPopup}
        training={training}
        volunteerTraining={volunteerTraining}
      />
    </>
  );
};

export default TrainingCard;

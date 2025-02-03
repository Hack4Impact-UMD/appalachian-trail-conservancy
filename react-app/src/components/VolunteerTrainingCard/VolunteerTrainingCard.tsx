import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VolunteerTrainingCard.module.css";
import PathwayTrainingPopup from "../PathwayTrainingPopup/PathwayTrainingPopup";
import { TrainingID } from "../../types/TrainingType";
import { VolunteerTraining } from "../../types/UserType";
import { Tooltip } from "@mui/material";
import { grayTooltip } from "../../muiTheme";

interface TrainingCardProps {
  training: TrainingID;
  volunteerTraining?: VolunteerTraining;
  preview: boolean;
  setPopupOpen?: any;
}

const VolunteerTrainingCard: React.FC<TrainingCardProps> = ({
  training,
  volunteerTraining,
  preview,
  setPopupOpen,
}) => {
  const [openTrainingPopup, setOpenTrainingPopup] = useState<boolean>(false);
  const navigate = useNavigate();

  const renderMarker = () => {
    if (!preview && volunteerTraining == undefined) {
      // Training not started
      return <div className={styles.marker}></div>;
    } else if (!preview && volunteerTraining!.progress === "COMPLETED") {
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
          if (!preview) {
            if (volunteerTraining == undefined) {
              setOpenTrainingPopup(true);
              setPopupOpen(true);
            } else {
              // Navigate to training landing page with training and volunteerTraining as state
              navigate(`/trainings/${training.id}`, {
                state: {
                  training: training,
                  volunteerTraining: volunteerTraining,
                },
              });
            }
          }
        }}>
        <div className={styles.trainingImage}>
          <img src={training.coverImage} alt="Training" />
        </div>
        <div className={styles.trainingContent}>
          <div className={styles.trainingTitleWrapper}>
            {training.name.length > 35 ? (
              <Tooltip
                title={training.name}
                arrow={false}
                placement="top-start"
                componentsProps={{
                  tooltip: {
                    sx: { ...grayTooltip, maxWidth: "200px" },
                  },
                }}>
                <div className={styles.trainingTitle}>
                  {training.name.substring(0, 36)}...
                </div>
              </Tooltip>
            ) : (
              <div className={styles.trainingTitle}>{training.name}</div>
            )}
          </div>
          <div className={styles.markerContainer}>{renderMarker()}</div>
        </div>
      </div>
      <PathwayTrainingPopup
        open={openTrainingPopup}
        onClose={() => {
          setOpenTrainingPopup(false);
          setPopupOpen(false);
        }}
        record={training}
        volunteerRecord={volunteerTraining}
        mode={"training"}
      />
    </>
  );
};

export default VolunteerTrainingCard;

import styles from "./AdminTrainingCard.module.css";
import { TrainingID } from "../../types/TrainingType";
import { Tooltip } from "@mui/material";
import { grayTooltip } from "../../muiTheme";
import { useNavigate } from "react-router-dom";

interface AdminTrainingCardProps {
  training: TrainingID;
}

const AdminTrainingCard: React.FC<AdminTrainingCardProps> = ({ 
  training 
}) => {
  const navigate = useNavigate();

  const renderMarker = () => {
    if (training.status === "DRAFT") {
      // Training drafted
      return (
        <div className={`${styles.marker} ${styles.draftMarker}`}>DRAFT</div>
      );
    } else if (training.status === "PUBLISHED") {
      // Training published
      return (
        <div className={`${styles.marker} ${styles.publishedMarker}`}>
          PUBLISHED
        </div>
      );
    } else if (training.status === "ARCHIVED") {
      // Training archived
      return (
        <div className={`${styles.marker} ${styles.archiveMarker}`}>
          ARCHIVE
        </div>
      );
    }
  };

  return (
    <>
      <div className={styles.trainingCard}>
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
                }}
              >
                <div className={styles.trainingTitle}>
                  {training.name.substring(0, 36)}...
                </div>
              </Tooltip>
            ) : (
              <div className={styles.trainingTitle}>{training.name}</div>
            )}
          </div>
          <div className={styles.outsideMarker}>
            <div
              className={styles.marker}
              onClick={() => {
                navigate("/trainings/editor", { state: { training } });
              }}
            >
              EDIT
            </div>
            <div>{renderMarker()}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTrainingCard;

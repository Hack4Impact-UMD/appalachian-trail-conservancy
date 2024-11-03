import styles from "./AdminTrainingCard.module.css";
import { TrainingID } from "../../types/TrainingType";
import { Tooltip } from "@mui/material";
import { grayTooltip } from "../../muiTheme";

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
            {training.name.length > 30 ? (
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
                  {training.name.substring(0, 31)}...
                </div>
              </Tooltip>
            ) : (
              <div className={styles.trainingTitle}>{training.name}</div>
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

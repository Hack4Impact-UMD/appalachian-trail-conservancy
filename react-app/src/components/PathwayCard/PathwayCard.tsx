import { useState } from "react";
import styles from "./PathwayCard.module.css";
import LinearProgressWithLabel from "../LinearProgressWithLabel/LinearProgressWithLabel";
import pathwayCard from "../../assets/pathwayCard.svg";
import { useNavigate } from "react-router-dom";
import { PathwayID } from "../../types/PathwayType";
import { VolunteerPathway } from "../../types/UserType";
import { Tooltip } from "@mui/material";
import { grayTooltip } from "../../muiTheme";
import PathwayTrainingPopup from "../PathwayTrainingPopup/PathwayTrainingPopup";

interface PathwayCardProps {
  pathway: PathwayID;
  volunteerPathway?: VolunteerPathway;
}

const PathwayCard: React.FC<PathwayCardProps> = ({
  pathway,
  volunteerPathway,
}) => {
  const [openTrainingPopup, setOpenTrainingPopup] = useState<boolean>(false);

  const navigate = useNavigate();

  const renderMarker = () => {
    if (volunteerPathway == undefined) {
      // Training not started
      return <div className={styles.marker}></div>;
    } else if (
      volunteerPathway.numTrainingsCompleted ===
      volunteerPathway.numTotalTrainings
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
        <LinearProgressWithLabel
          value={
            ((volunteerPathway.numTrainingsCompleted +
              (volunteerPathway.quizScoreRecieved ? 1 : 0)) /
              (volunteerPathway.numTotalTrainings + 1)) *
            100
          }
        />
      );
    }
  };

  return (
    <div
      className={styles.pathwayCard}
      onClick={() => {
        if (volunteerPathway == undefined) {
          setOpenTrainingPopup(true);
        } else {
          navigate(`/pathways/${pathway.id}`, {
            state: {
              pathway: pathway,
              volunteerPathway: volunteerPathway,
            },
          });
        }
      }}>
      <div className={styles.pathwayImage}>
        <img src={pathwayCard} alt="Pathway" />
      </div>
      <div className={styles.pathwayContent}>
        <div className={styles.pathwayTitleWrapper}>
          {pathway.name.length > 30 ? (
            <Tooltip
              title={pathway.name}
              arrow={false}
              placement="top-start"
              componentsProps={{
                tooltip: {
                  sx: { ...grayTooltip, maxWidth: "350px" },
                },
              }}>
              <div className={styles.pathwayTitle}>
                {pathway.name.substring(0, 31)}...
              </div>
            </Tooltip>
          ) : (
            <div className={styles.pathwayTitle}>{pathway.name}</div>
          )}
        </div>

        <div className={styles.markerContainer}>{renderMarker()}</div>
      </div>
      <PathwayTrainingPopup
        open={openTrainingPopup}
        onClose={setOpenTrainingPopup}
        record={pathway}
        volunteerRecord={volunteerPathway}
        mode={"pathway"}
      />
    </div>
  );
};

export default PathwayCard;

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
  preview: boolean;
  setPopupOpen?: any;
}

const PathwayCard: React.FC<PathwayCardProps> = ({
  pathway,
  volunteerPathway,
  preview,
  setPopupOpen,
}) => {
  const [openTrainingPopup, setOpenTrainingPopup] = useState<boolean>(false);

  const navigate = useNavigate();

  const renderMarker = () => {
    if (!preview && volunteerPathway == undefined) {
      // Training not started
      return <div className={styles.marker}></div>;
    } else if (preview || volunteerPathway!.progress === "COMPLETED") {
      // Training completed
      return (
        <div className={`${styles.marker} ${styles.completedMarker}`}>
          COMPLETED
        </div>
      );
    } else {
      // Training in progress
      return (
        // Quiz is not completed
        <LinearProgressWithLabel
          value={
            (volunteerPathway!.numTrainingsCompleted /
              (volunteerPathway!.numTotalTrainings + 1)) *
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
        if (!preview) {
          if (volunteerPathway == undefined) {
            setOpenTrainingPopup(true);
            setPopupOpen(true);
          } else {
            navigate(`/pathways/${pathway.id}`, {
              state: {
                pathway: pathway,
                volunteerPathway: volunteerPathway,
              },
            });
          }
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
        onClose={() => {
          setOpenTrainingPopup(false);
          setPopupOpen(false);
        }}
        record={pathway}
        volunteerRecord={volunteerPathway}
        mode={"pathway"}
      />
    </div>
  );
};

export default PathwayCard;

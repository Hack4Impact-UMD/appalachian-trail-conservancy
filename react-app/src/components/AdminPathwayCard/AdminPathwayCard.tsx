import styles from "./AdminPathwayCard.module.css";
import pathwayCard from "../../assets/pathwayCard.svg";
import { useNavigate } from "react-router-dom";
import { PathwayID } from "../../types/PathwayType";
import { Tooltip } from "@mui/material";
import { grayTooltip } from "../../muiTheme";

interface PathwayCardProps {
  pathway: PathwayID;
}

const AdminPathwayCard: React.FC<PathwayCardProps> = ({ pathway }) => {
  const navigate = useNavigate();

  const renderMarker = () => {
    if (pathway.status === "DRAFT") {
      // Pathway drafted
      return (
        <div className={`${styles.marker} ${styles.draftMarker}`}>DRAFT</div>
      );
    } else if (pathway.status === "PUBLISHED") {
      // Pathway published
      return (
        <div className={`${styles.marker} ${styles.publishedMarker}`}>
          PUBLISHED
        </div>
      );
    } else if (pathway.status === "ARCHIVED") {
      // Pathway archived
      return (
        <div className={`${styles.marker} ${styles.archiveMarker}`}>
          ARCHIVE
        </div>
      );
    }
  };

  return (
    <div
      className={styles.pathwayCard}
      onClick={() => {
        navigate("/pathways/editor", { state: { pathway } });
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
        <div className={styles.outsideMarker}>
          <div className={styles.marker}>EDIT</div>
          <div>{renderMarker()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminPathwayCard;

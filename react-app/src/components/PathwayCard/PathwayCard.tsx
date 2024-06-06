import styles from "./PathwayCard.module.css";
import LinearProgressWithLabel from "../LinearProgressWithLabel/LinearProgressWithLabel";
import pathwayCard from "../../assets/pathwayCard.svg";
import { useNavigate } from "react-router-dom";
import { PathwayID } from "../../types/PathwayType";
import { VolunteerPathway } from "../../types/UserType";

interface PathwayCardProps {
  pathway: PathwayID;
  volunteerPathway?: VolunteerPathway;
}

const PathwayCard: React.FC<PathwayCardProps> = ({
  pathway,
  volunteerPathway,
}) => {
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
        navigate(`/pathways/${pathway.id}`, {
          state: {
            pathway: pathway,
            volunteerPathway: volunteerPathway,
          },
        });
      }}>
      <div className={styles.pathwayImage}>
        <img src={pathwayCard} alt="Pathway" />
      </div>
      <div className={styles.pathwayContent}>
        <div className={styles.pathwayTitle}>
          {pathway.name.substring(0, 31)}
          {pathway.name.length > 30 ? "..." : ""}
        </div>
        <div className={styles.progressBar}>{renderMarker()}</div>
      </div>
    </div>
  );
};

export default PathwayCard;

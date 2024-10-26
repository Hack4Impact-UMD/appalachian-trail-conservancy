import { useState } from "react";
import styles from "./AdminPathwayCard.module.css";
import pathwayCard from "../../assets/pathwayCard.svg";
import { useNavigate } from "react-router-dom";
import { PathwayID } from "../../types/PathwayType";

interface PathwayCardProps {
  pathway: PathwayID;
}

const AdminPathwayCard: React.FC<PathwayCardProps> = ({ pathway }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.pathwayCard}>
      <div className={styles.pathwayImage}>
        <img src={pathwayCard} alt="Pathway" />
      </div>
      <div className={styles.pathwayContent}>
        <div className={styles.pathwayTitleWrapper}>
          <div className={styles.pathwayTitle}>
            {pathway.name.substring(0, 31)}
            {pathway.name.length > 30 ? "..." : ""}
          </div>
          {pathway.name.length > 30 && (
            <span className={styles.tooltip}>{pathway.name}</span>
          )}
        </div>
        <div className={styles.progressBar}>
          {<div className={`${styles.marker}`}>EDIT</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminPathwayCard;

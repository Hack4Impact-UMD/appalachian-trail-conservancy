import { useState } from "react";
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

  return (
    <div className={styles.pathwayCard}>
      <div className={styles.pathwayImage}>
        <img src={pathwayCard} alt="Pathway" />
      </div>
      <div className={styles.pathwayContent}>
        <div className={styles.pathwayTitleWrapper}>
          {pathway.name.length > 35 ? (
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
                {pathway.name.substring(0, 36)}...
              </div>
            </Tooltip>
          ) : (
            <div className={styles.pathwayTitle}>{pathway.name}</div>
          )}
        </div>
        <div className={styles.progressBar}>
          {<div className={styles.marker}>EDIT</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminPathwayCard;

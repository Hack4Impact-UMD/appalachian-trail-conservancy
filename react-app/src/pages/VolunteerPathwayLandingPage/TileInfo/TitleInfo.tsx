import React, { useState } from "react";
import ProfileIcon from "../../../components/ProfileIcon/ProfileIcon";
import styles from "./TitleInfo.module.css";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import { VolunteerPathway } from "../../../types/UserType.ts";
import { grayTooltip } from "../../../muiTheme.ts";

interface TitleInfoProps {
  title: string;
  description: string;
  volunteerPathway: VolunteerPathway;
}

const TitleInfo: React.FC<TitleInfoProps> = ({
  title,
  description,
  volunteerPathway,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [openLinkSharePopup, setLinkSharePopup] = useState<boolean>(false);

  const renderMarker = () => {
    if (volunteerPathway?.pathwayID === "") {
      // Pathway not started
      return <></>;
    } else if (
      volunteerPathway.pathwayID !== "" &&
      volunteerPathway.numTrainingsCompleted ===
        volunteerPathway.numTotalTrainings &&
      volunteerPathway.dateCompleted !== ""
    ) {
      // Pathway completed
      return (
        <>
          <div className={`${styles.marker} ${styles.pathwayMarker}`}>
            PATHWAY
          </div>
          <div className={`${styles.marker} ${styles.progressMarker}`}>
            COMPLETED
          </div>
        </>
      );
    }
    // Pathway in progress
    else
      return (
        <>
          <div className={`${styles.marker} ${styles.pathwayMarker}`}>
            PATHWAY
          </div>
          <div className={`${styles.marker} ${styles.progressMarker}`}>
            IN PROGRESS
          </div>
        </>
      );
  };

  return (
    <div className={styles.container}>
      {/* Profile Icon and Title */}
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.nameShareContainer}>
            <h1 className={styles.nameHeading}>{title}</h1>
            <Tooltip
              title={"Share link"}
              componentsProps={{
                tooltip: {
                  sx: { ...grayTooltip, fontSize: "0.75rem" },
                },
              }}>
              <span>
                <IoShareSocialOutline
                  className={styles.shareIcon}
                  onClick={() => setLinkSharePopup(true)}
                />
              </span>
            </Tooltip>
          </div>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={styles.arrowButton}>
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            {/* Change arrow direction based on state */}
          </div>
        </div>
        <div className={styles.profileIcon}>
          <ProfileIcon />
        </div>
      </div>
      <div className={styles.progressContainer}>{renderMarker()}</div>

      {/* Description Section */}
      {isOpen && (
        <div className={styles.description}>
          <h2>Description</h2>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}
    </div>
  );
};

export default TitleInfo;

import React, { useState } from "react";
import ProfileIcon from "../../../components/ProfileIcon/ProfileIcon";
import styles from "./TitleInfo.module.css";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import { VolunteerPathway } from "../../../types/UserType.ts";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        <h1 className={styles.nameHeading}>{title}</h1>
        <div onClick={() => setIsOpen(!isOpen)} className={styles.arrowButton}>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          {/* Change arrow direction based on state */}
        </div>
        <ProfileIcon />
      </div>
      <div className={styles.progressContainer}>{renderMarker()}</div>

      {/* Description Section */}
      {isOpen && (
        <div className={styles.description}>
          <h2>Blurb</h2>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}
    </div>
  );
};

export default TitleInfo;

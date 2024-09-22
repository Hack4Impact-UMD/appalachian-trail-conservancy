import React, { useState } from "react";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import styles from "./TitleInfo.module.css";

interface TitleInfoProps {
  title: string;
  description: string;
}

const TitleInfo: React.FC<TitleInfoProps> = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      {/* Profile Icon and Title */}
      <div className={styles.header}>
        <h1 className={styles.nameHeading}>{title}</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.arrowButton}
        >
          {isOpen ? "▲" : "▼"} {/* Change arrow direction based on state */}
        </button>
        <ProfileIcon />
      </div>

      {/* Blurb Section */}
      {isOpen && (
        <div className={styles.blurb}>
          <strong className={styles.blurbButton}>Blurb</strong>
          <p className={styles.description}>{description}</p>
        </div>
      )}
    </div>
  );
};

export default TitleInfo;

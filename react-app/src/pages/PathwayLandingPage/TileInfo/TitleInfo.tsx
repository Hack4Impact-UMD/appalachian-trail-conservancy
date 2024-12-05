import React, { useState } from "react";
import ProfileIcon from "../../../components/ProfileIcon/ProfileIcon";
import styles from "./TitleInfo.module.css";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";

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
        <div onClick={() => setIsOpen(!isOpen)} className={styles.arrowButton}>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          {/* Change arrow direction based on state */}
        </div>
        <ProfileIcon />
      </div>

      {/* Blurb Section */}
      {isOpen && (
        <div className={styles.blurb}>
          <h2>Blurb</h2>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

export default TitleInfo;

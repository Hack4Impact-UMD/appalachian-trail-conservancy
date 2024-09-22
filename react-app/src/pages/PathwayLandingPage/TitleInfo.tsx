import React, { useState } from "react";
import styles from "./TitleInfo.module.css";

interface TitleInfoProps {
  title: string;
  description: string;
}

const TitleInfo: React.FC<TitleInfoProps> = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <div className={styles.blurb}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.blurbButton}
        >
          {isOpen ? "Hide Description" : "Show Description"}
        </button>
        {isOpen && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
};

export default TitleInfo;

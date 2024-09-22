import React, { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import TitleInfo from "./TitleInfo";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import styles from "./PathwayLandingPage.module.css";

const PathwayLandingPage: React.FC = () => {
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);

  const pathwayTitle = "Sample Pathway Title";
  const pathwayDescription = "Sampl description for the pathway.";

  return (
    <div className={styles.pageContainer}>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div className={styles.content}>
        <div className={styles.header}>
          <ProfileIcon />
          <h1 className={styles.title}>{pathwayTitle}</h1>
        </div>
        <TitleInfo title={pathwayTitle} description={pathwayDescription} />
      </div>
    </div>
  );
};

export default PathwayLandingPage;

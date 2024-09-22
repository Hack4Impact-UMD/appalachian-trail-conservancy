import React, { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import TitleInfo from "./TitleInfo";
import styles from "./PathwayLandingPage.module.css";
import PathwayTile from "./PathwayTile";

const PathwayLandingPage: React.FC = () => {
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);

  const pathwayTitle = "Sample Pathway Title";
  const pathwayDescription = "Sample description for the pathway.";

  return (
    <div className={styles.pageContainer}>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />

      <div className={styles.content}>
        <TitleInfo title={pathwayTitle} description={pathwayDescription} />

        {/* Pathway Tiles Section */}
        <div className={styles.pathwayTiles}>
          <PathwayTile />
        </div>
      </div>
    </div>
  );
};

export default PathwayLandingPage;

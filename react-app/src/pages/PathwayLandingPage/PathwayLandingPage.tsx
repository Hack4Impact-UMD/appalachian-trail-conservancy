import React, { useState, useEffect, useRef } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import TitleInfo from "./TitleInfo";
import styles from "./PathwayLandingPage.module.css";
import PathwayTile from "./PathwayTile";
 
const PathwayLandingPage: React.FC = () => {
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [divWidth, setDivWidth] = useState<number>();

  // Can this be done better?
  // Gets the current pathway id from url, url in form: .../pathways/<ID#>
  const pathwayId = window.location.href.substring(window.location.href.length-20,window.location.href.length);

  const div = useRef<HTMLDivElement>(null);

  const pathwayTitle = "Sample Pathway Title";
  const pathwayDescription = "Sample description for the pathway.";
  const trainingNum = 5;
  const imgSize = 55;
  const width = divWidth;

  useEffect(() => {
    if (div.current) {
      setDivWidth(div.current.offsetWidth);
    }
  }, []);
  
  return (
    <div className={styles.pageContainer}>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />

      <div className={styles.content}>
        <TitleInfo title={pathwayTitle} description={pathwayDescription} />

        {/* Pathway Tiles Section */}
        <div className={styles.pathwayTiles} ref={div}>
          {console.log(divWidth)}
        </div>
      </div>
    </div>
  );
};

export default PathwayLandingPage;

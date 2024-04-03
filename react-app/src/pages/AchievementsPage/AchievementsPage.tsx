import { useState } from "react";
import styles from "./AchievementsPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import { styledButtonGreen, styledButtonWhiteBlack } from "../../muiTheme";
import { Button } from "@mui/material";
import { MdSort } from "react-icons/md";

function AchievementsPage() {
  const [badgesSelected, setBadgesSelected] = useState<boolean>(true); // Initial selected button

  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.header}>
          <h1 className={styles.nameHeading}>Achievements</h1>
          <ProfileIcon />
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.leftButtonContainer}>
            <div className={styles.button}>
              <Button
                onClick={() => setBadgesSelected(true)}
                sx={
                  badgesSelected ? styledButtonGreen : styledButtonWhiteBlack
                }>
                Pathway Badges
              </Button>
            </div>
            <div className={styles.button}>
              <Button
                onClick={() => setBadgesSelected(false)}
                sx={
                  !badgesSelected ? styledButtonGreen : styledButtonWhiteBlack
                }>
                Training Certificates
              </Button>
            </div>
          </div>
          <Button sx={styledButtonWhiteBlack}>
            <MdSort />
            Sort
          </Button>
        </div>
        <div className={styles.cardsContainer}></div>
      </div>
    </>
  );
}

export default AchievementsPage;

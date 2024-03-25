import React from "react";
import styles from "./AchievementsPage.module.css";
import { darkGreenButton, whiteEmptyButton } from "../../muiTheme";
import { Button } from "@mui/material";
import { MdSort } from "react-icons/md";


function AchievementsPage() {
  const [selectedButtonIndex, setSelectedButtonIndex] = React.useState(0); // Initial selected button

  const handleClick = (index: React.SetStateAction<number>) => {
    setSelectedButtonIndex(index);
  };

  return (
    <>
      <div className={`${styles.split} ${styles.left}`}></div>
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.header}>
          <h1 className={styles.nameHeading}>Trainings in Progress</h1>
          {/* PLACEHOLDER IMAGE */}
          <div className={styles.imgContainer}>
            <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.leftButtonContainer}>
            <div className={styles.button}>
            <Button
              onClick={() => handleClick(0)}
              sx={
                selectedButtonIndex === 0
                  ? darkGreenButton
                  : whiteEmptyButton
              }>
              Pathway Badges
            </Button>
            </div>
            <div className={styles.button}>
            <Button
              onClick={() => handleClick(1)}
              sx={
                selectedButtonIndex === 1
                  ? darkGreenButton
                  : whiteEmptyButton
              }>
              Training Certificates
            </Button>
            </div>
          </div>
          <Button sx = {whiteEmptyButton}> <MdSort/>Sort</Button>
        </div>
        <div className={styles.cardsContainer}></div>
      </div>
    </>
  );
}

export default AchievementsPage;

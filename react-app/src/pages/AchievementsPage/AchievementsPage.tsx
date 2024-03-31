import styles from "./AchievementsPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { darkGreenButton, whiteEmptyButton } from "../../muiTheme";
import { FormControl, Select, MenuItem, Button } from "@mui/material";
import { useState, useEffect } from "react";
import Certificate from "../../components/CertificateCard/Certificate";

function AchievementsPage() {
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", 
  "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  const certificates = [
    {title: "Appalachian",  date: "FEBRUARY 1, 2024"},
    {title: "Beach", date: "DECEMBER 4, 2023"},
    {title: "Ocean", date: "AUGUST 17, 2022"},
    {title: "Savanahh", date: "JANUARY 5, 2020"},
    {title: "Yosemite", date: "MAY 4, 2023"}
  ]

  const [badgesSelected, setBadgesSelected] = useState<boolean>(true); 
  const [sortMode, setSortMode] = useState<string>("newest");
  const [sortedCards, setSortedCards] = useState< 
    {title: string; date: string; image: string}[]> ([]);

    const parseDate = (dateString: string) => {
      const [month, day, year] = dateString.split(" ");
      const monthIndex = months.indexOf(month.toUpperCase()) + 1;
      return `${year}-${monthIndex < 10 ? "0" + monthIndex : monthIndex}-${day}`;
    };

    const sortCards = () => {
      let sortedCardsCopy = [...sortedCards];

      switch (sortMode) {
        case "alphabetical":
          sortedCardsCopy.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "reverse-alphabetical":
          sortedCardsCopy.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "newest":
          sortedCardsCopy.sort((a, b) => {
            const dateA = new Date(parseDate(a.date));
            const dateB = new Date(parseDate(b.date));
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case "oldest":
          sortedCardsCopy.sort((a, b) => {
            const dateA = new Date(parseDate(a.date));
            const dateB = new Date(parseDate(b.date));
            return dateA.getTime() - dateB.getTime();
          });
          break;
      }
    
      setSortedCards(sortedCardsCopy);
    };

  const handleChange = (event: any) => {
    setSortMode(event.target.value);
    sortCards();

  };

  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.header}>
          <h1 className={styles.nameHeading}>Achievements</h1>
          {/* PLACEHOLDER IMAGE */}
          <div className={styles.imgContainer}>
            <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.leftButtonContainer}>
            <div className={styles.button}>
              <Button
                onClick={() => setBadgesSelected(true)}
                sx={badgesSelected ? darkGreenButton : whiteEmptyButton}
              >
                Pathway Badges
              </Button>
            </div>
            <div className={styles.button}>
              <Button
                onClick={() => setBadgesSelected(false)}
                sx={!badgesSelected ? darkGreenButton : whiteEmptyButton}
              >
                Training Certificates
              </Button>
            </div>
          </div>
          <FormControl>
            <Select
              value={sortMode}
              onChange={handleChange}
            >
              <MenuItem value={"newest"}>SORT: NEWEST</MenuItem>
              <MenuItem value={"oldest"}>SORT: OLDEST</MenuItem>
              <MenuItem value={"alphabetically"}>SORT: A-Z</MenuItem>
              <MenuItem value={"reverseAlphabetically"}>SORT: Z-A</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={styles.cardsContainer}>
        {sortedCards.map((card, index) => (
          <Certificate
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title={card.title}
            date={card.date}
          />
          ))}
        </div>
      </div>
    </>
  );
}

export default AchievementsPage;

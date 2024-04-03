import styles from "./AchievementsPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Certificate from "../../components/CertificateCard/Certificate";
import { Select, MenuItem, Button } from "@mui/material";
import { useState, useEffect } from "react";
import {
  darkGreenButton,
  whiteEmptyButton,
  styledSelectWhiteBlack,
} from "../../muiTheme";

function AchievementsPage() {
  const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const certificates = [
    { title: "Appalachian", date: "FEBRUARY 1, 2024", image: "" },
    { title: "Beach", date: "DECEMBER 4, 2023", image: "" },
    { title: "Ocean", date: "AUGUST 17, 2022", image: "" },
    { title: "Savanahh", date: "JANUARY 5, 2020", image: "" },
    { title: "Yosemite", date: "MAY 4, 2023", image: "" },
  ];

  const [badgesSelected, setBadgesSelected] = useState<boolean>(true);
  const [sortMode, setSortMode] = useState<string>("newest");
  const [sortedCards, setSortedCards] = useState<
    { title: string; date: string; image: string }[]
  >([]);

  const parseDate = (dateString: string) => {
    const [month, day, year] = dateString.split(" ");
    const monthIndex = months.indexOf(month.toUpperCase()) + 1;
    return `${year}-${monthIndex < 10 ? "0" + monthIndex : monthIndex}-${day}`;
  };

  const sortCards = () => {
    let sortedCardsCopy = certificates;

    switch (sortMode) {
      case "alphabetically":
        sortedCardsCopy.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "reverseAlphabetically":
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

  useEffect(() => {
    sortCards();
  }, [sortMode]);

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
            <Button
              onClick={() => setBadgesSelected(true)}
              sx={badgesSelected ? darkGreenButton : whiteEmptyButton}
            >
              Pathway Badges
            </Button>
            <Button
              onClick={() => setBadgesSelected(false)}
              sx={!badgesSelected ? darkGreenButton : whiteEmptyButton}
            >
              Training Certificates
            </Button>
          </div>
          <div className={styles.rightButtonContainer}>
            <Select
              value={sortMode}
              onChange={handleChange}
              size="small"
              sx={{
                ...styledSelectWhiteBlack,
                border: "2px solid dimgray",
                "&:hover": {
                  backgroundColor: "white",
                  color: "dimgray",
                },
                borderRadius: "10px",
                "& fieldset": { border: "none" },
                width: "154px",
              }}
            >
              <MenuItem value={"newest"} sx={styledSelectWhiteBlack}>
                SORT: NEWEST
              </MenuItem>
              <MenuItem value={"oldest"} sx={styledSelectWhiteBlack}>
                SORT: OLDEST
              </MenuItem>
              <MenuItem value={"alphabetically"} sx={styledSelectWhiteBlack}>
                SORT: A-Z
              </MenuItem>
              <MenuItem
                value={"reverseAlphabetically"}
                sx={styledSelectWhiteBlack}
              >
                SORT: Z-A
              </MenuItem>
            </Select>
          </div>
        </div>
        <div className={styles.cardsContainer}>
          {sortedCards.map((card, index) => (
            <Certificate
              key={index}
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

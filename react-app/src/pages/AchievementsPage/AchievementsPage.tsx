import { Select, MenuItem, Button } from "@mui/material";
import { useState, useEffect } from "react";
import {
  forestGreenButtonPadding,
  whiteButtonGrayBorder,
  selectOptionStyle,
  whiteSelectGrayBorder,
} from "../../muiTheme";
import styles from "./AchievementsPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Certificate from "../../components/CertificateCard/CertificateCard";
import LogoutPopup from "../../components/LogoutPopup/LogoutPopup";

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
  const [openLogoutPopup, setOpenLogoutPopup] = useState<boolean>(false);
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
      <NavigationBar setOpenLogoutPopup={setOpenLogoutPopup} />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.header}>
          <h1 className={styles.nameHeading}>Achievements</h1>
          <ProfileIcon />
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.leftButtonContainer}>
            <Button
              onClick={() => setBadgesSelected(true)}
              sx={
                badgesSelected
                  ? forestGreenButtonPadding
                  : whiteButtonGrayBorder
              }
              variant="contained">
              Pathway Badges
            </Button>
            <Button
              onClick={() => setBadgesSelected(false)}
              sx={
                !badgesSelected
                  ? forestGreenButtonPadding
                  : whiteButtonGrayBorder
              }
              variant="contained">
              Training Certificates
            </Button>
          </div>
          <div className={styles.rightButtonContainer}>
            <Select
              value={sortMode}
              onChange={handleChange}
              size="small"
              sx={{
                ...whiteSelectGrayBorder,
                width: "154px",
              }}>
              <MenuItem value={"newest"} sx={selectOptionStyle}>
                SORT: NEWEST
              </MenuItem>
              <MenuItem value={"oldest"} sx={selectOptionStyle}>
                SORT: OLDEST
              </MenuItem>
              <MenuItem value={"alphabetically"} sx={selectOptionStyle}>
                SORT: A-Z
              </MenuItem>
              <MenuItem value={"reverseAlphabetically"} sx={selectOptionStyle}>
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
        <div>
          <LogoutPopup 
            open={openLogoutPopup} 
            onClose={setOpenLogoutPopup} 
          />
      </div>
      </div>
    </>
  );
}

export default AchievementsPage;

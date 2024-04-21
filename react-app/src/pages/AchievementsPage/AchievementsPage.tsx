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
import Footer from "../../components/Footer/Footer";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Certificate from "../../components/CertificateCard/CertificateCard";
import { DateTime } from "luxon";
import badge from "../../assets/badge.svg";

function AchievementsPage() {
  const certificates = [
    { title: "Appalachian", date: "2024-02-01", image: "" },
    { title: "Beach", date: "2023-12-04", image: "" },
    { title: "Ocean", date: "2022-08-17", image: "" },
    { title: "Savanahh", date: "2020-01-05", image: "" },
    { title: "Yosemite", date: "2023-05-04", image: "" },
  ];

  const [badgesSelected, setBadgesSelected] = useState<boolean>(true);
  const [sortMode, setSortMode] = useState<string>("newest");
  const [sortedCards, setSortedCards] = useState<
    { title: string; date: string; image: string }[]
  >([]);

  const sortCards = () => {
    let sortedCardsCopy = certificates.slice();

    switch (sortMode) {
      case "alphabetically":
        sortedCardsCopy.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "reverseAlphabetically":
        sortedCardsCopy.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
        sortedCardsCopy.sort((a, b) => {
          const dateA = DateTime.fromISO(a.date);
          const dateB = DateTime.fromISO(b.date);
          return dateB.toMillis() - dateA.toMillis();
        });
        break;
      case "oldest":
        sortedCardsCopy.sort((a, b) => {
          const dateA = DateTime.fromISO(a.date);
          const dateB = DateTime.fromISO(b.date);
          return dateA.toMillis() - dateB.toMillis();
        });
        break;
      default:
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
        <div className={styles.outerContainer}>
          <div className={styles.content}>
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
                  <MenuItem
                    value={"reverseAlphabetically"}
                    sx={selectOptionStyle}>
                    SORT: Z-A
                  </MenuItem>
                </Select>
              </div>
            </div>
            <div className={styles.cardsContainer}>
              {sortedCards.map((card, index) => (
                <Certificate
                  key={index}
                  image={badge}
                  title={card.title}
                  date={card.date}
                />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AchievementsPage;

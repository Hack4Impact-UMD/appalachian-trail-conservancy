import { Select, MenuItem, Button } from "@mui/material";
import { useState, useEffect } from "react";
import {
  forestGreenButtonPadding,
  whiteButtonGrayBorder,
  selectOptionStyle,
  whiteSelectGrayBorder,
} from "../../muiTheme";
import {
  getVolunteer,
  getAllTrainings,
  getAllPathways,
  getTraining,
} from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { VolunteerTraining, VolunteerPathway } from "../../types/UserType";
import { PathwayID } from "../../types/PathwayType";
import { DateTime } from "luxon";
import styles from "./AchievementsPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Certificate from "../../components/CertificateCard/CertificateCard";
import badge from "../../assets/badge.svg";
import { useAuth } from "../../auth/AuthProvider";
import Badge from "../../components/BadgeCard/BadgeCard";

function AchievementsPage() {
  const auth = useAuth();
  const [badgesSelected, setBadgesSelected] = useState<boolean>(true);
  const [sortMode, setSortMode] = useState<string>("newest");
  const [sortedCards, setSortedCards] = useState<
    { title: string; date: string; image: string }[]
  >([]);

  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [correlatedTrainings, setCorrelatedTrainings] = useState<
    { genericTraining: TrainingID; volunteerTraining: VolunteerTraining }[]
  >([]);
  const [correlatedPathways, setCorrelatedPathways] = useState<
    { genericPathway: PathwayID; volunteerPathway: VolunteerPathway }[]
  >([]);

  useEffect(() => {
    getAllTrainings().then((genericTrainings) => {
      if (!auth.loading && auth.id) {
        getVolunteer(auth.id.toString()).then((volunteer) => {
          const volunteerTrainings = volunteer.trainingInformation;
          let allCorrelatedTrainings: {
            genericTraining: TrainingID;
            volunteerTraining: VolunteerTraining;
          }[] = [];
          for (const genericTraining of genericTrainings) {
            let found = false;
            for (const volunteerTraining of volunteerTrainings) {
              if (genericTraining.id == volunteerTraining.trainingID) {
                found = true;
                if (volunteerTraining.progress === "COMPLETED") {
                  allCorrelatedTrainings.push({
                    genericTraining: genericTraining,
                    volunteerTraining: volunteerTraining,
                  });
                }
              }
            }
          }
          setCorrelatedTrainings(allCorrelatedTrainings);
        });
      }
    });

    getAllPathways().then((genericPathways) => {
      if (!auth.loading && auth.id) {
        getVolunteer(auth.id.toString()).then((volunteer) => {
          const volunteerPathways = volunteer.pathwayInformation;
          let allCorrelatedPathways: {
            genericPathway: PathwayID;
            volunteerPathway: VolunteerPathway;
          }[] = [];
          for (const genericPathway of genericPathways) {
            let found = false;
            for (const volunteerPathway of volunteerPathways) {
              if (genericPathway.id == volunteerPathway.pathwayID) {
                found = true;
                if (volunteerPathway.progress === "COMPLETED") {
                  allCorrelatedPathways.push({
                    genericPathway: genericPathway,
                    volunteerPathway: volunteerPathway,
                  });
                }
              }
            }
          }
          setCorrelatedPathways(allCorrelatedPathways);
        });
      }
    });
  });

  const sortCards = () => {
    let sortedCopy;
    if (badgesSelected) {
      sortedCopy = correlatedPathways.slice();
      switch (sortMode) {
        case "alphabetically":
          sortedCopy.sort((a, b) =>
            a.genericPathway.name.localeCompare(b.genericPathway.name)
          );
          break;
        case "reverseAlphabetically":
          sortedCopy.sort((a, b) =>
            b.genericPathway.name.localeCompare(a.genericPathway.name)
          );
          break;
        case "newest":
          sortedCopy.sort((a, b) => {
            const dateA = DateTime.fromISO(a.volunteerPathway.dateCompleted);
            const dateB = DateTime.fromISO(b.volunteerPathway.dateCompleted);
            return dateB.toMillis() - dateA.toMillis();
          });
          break;
        case "oldest":
          sortedCopy.sort((a, b) => {
            const dateA = DateTime.fromISO(a.volunteerPathway.dateCompleted);
            const dateB = DateTime.fromISO(b.volunteerPathway.dateCompleted);
            return dateA.toMillis() - dateB.toMillis();
          });
          break;
      }

      setCorrelatedPathways(sortedCopy);
    } else {
      sortedCopy = correlatedTrainings.slice();
      switch (sortMode) {
        case "alphabetically":
          sortedCopy.sort((a, b) =>
            a.genericTraining.name.localeCompare(b.genericTraining.name)
          );

          break;
        case "reverseAlphabetically":
          sortedCopy.sort((a, b) =>
            b.genericTraining.name.localeCompare(a.genericTraining.name)
          );
          break;
        case "newest":
          sortedCopy.sort((a, b) => {
            const dateA = DateTime.fromISO(a.volunteerTraining.dateCompleted);
            const dateB = DateTime.fromISO(b.volunteerTraining.dateCompleted);
            return dateB.toMillis() - dateA.toMillis();
          });
          break;
        case "oldest":
          sortedCopy.sort((a, b) => {
            const dateA = DateTime.fromISO(a.volunteerTraining.dateCompleted);
            const dateB = DateTime.fromISO(b.volunteerTraining.dateCompleted);
            return dateA.toMillis() - dateB.toMillis();
          });
          break;
      }

      setCorrelatedTrainings(sortedCopy);
    }
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
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
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
                  variant="contained"
                >
                  Pathway Badges
                </Button>
                <Button
                  onClick={() => setBadgesSelected(false)}
                  sx={
                    !badgesSelected
                      ? forestGreenButtonPadding
                      : whiteButtonGrayBorder
                  }
                  variant="contained"
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
                    ...whiteSelectGrayBorder,
                    width: "154px",
                  }}
                >
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
                    sx={selectOptionStyle}
                  >
                    SORT: Z-A
                  </MenuItem>
                </Select>
              </div>
            </div>
            <div className={styles.cardsContainer}>
              {badgesSelected ? (
                <>
                  {correlatedPathways.map((pathway, index) => (
                    <Badge
                      title={pathway.genericPathway.name}
                      date={pathway.volunteerPathway.dateCompleted}
                    />
                  ))}
                </>
              ) : (
                <>
                  {correlatedTrainings.map((training, index) => (
                    <Certificate
                      title={training.genericTraining.name}
                      image={training.genericTraining.coverImage}
                      date={training.volunteerTraining.dateCompleted}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AchievementsPage;

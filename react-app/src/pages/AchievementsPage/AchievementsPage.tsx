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
} from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { VolunteerTraining, VolunteerPathway } from "../../types/UserType";
import { PathwayID } from "../../types/PathwayType";
import { DateTime } from "luxon";
import styles from "./AchievementsPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import hamburger from "../../assets/hamburger.svg";

import Footer from "../../components/Footer/Footer";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Certificate from "../../components/CertificateCard/CertificateCard";
import { useAuth } from "../../auth/AuthProvider";
import Badge from "../../components/BadgeCard/BadgeCard";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/LoadingScreen/Loading";

function AchievementsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [badgesSelected, setBadgesSelected] = useState<boolean>(true);
  const [sortMode, setSortMode] = useState<string>("newest");
  const [correlatedTrainings, setCorrelatedTrainings] = useState<
    { genericTraining: TrainingID; volunteerTraining: VolunteerTraining }[]
  >([]);
  const [correlatedPathways, setCorrelatedPathways] = useState<
    { genericPathway: PathwayID; volunteerPathway: VolunteerPathway }[]
  >([]);
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getAllTrainings().then((genericTrainings) => {
      if (!auth.loading && auth.id) {
        setLoading(true);
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
          let sortedCopy = allCorrelatedTrainings.slice();
          sortedCopy.sort((a, b) => {
            const dateA = DateTime.fromISO(a.volunteerTraining.dateCompleted);
            const dateB = DateTime.fromISO(b.volunteerTraining.dateCompleted);
            return dateB.toMillis() - dateA.toMillis();
          });
          setCorrelatedTrainings(sortedCopy);
          setLoading(false);
        });
      }
    });
    getAllPathways().then((genericPathways) => {
      if (!auth.loading && auth.id) {
        setLoading(true);
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
          let sortedCopy = allCorrelatedPathways.slice();
          sortedCopy.sort((a, b) => {
            const dateA = DateTime.fromISO(a.volunteerPathway.dateCompleted);
            const dateB = DateTime.fromISO(b.volunteerPathway.dateCompleted);
            return dateB.toMillis() - dateA.toMillis();
          });
          setCorrelatedPathways(sortedCopy);
          setLoading(false);
        });
      }
    });
  }, [auth.loading, auth.id]);

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

  const handleSortChange = (event: any) => {
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
        style={{
          // Only apply left shift when screen width is greater than 1200px
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}
      >
        {!navigationBarOpen && (
          <img
            src={hamburger}
            alt="Hamburger Menu"
            className={styles.hamburger} // Add styles to position it
            width={30}
            onClick={() => setNavigationBarOpen(true)} // Set sidebar open when clicked
          />
        )}
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Achievements</h1>
              <ProfileIcon />
            </div>
            <div className={styles.buttonContainer}>
              <div className={styles.leftButtonContainer}>
                <Button
                  onClick={() => {
                    setBadgesSelected(true);
                    setSortMode("newest");
                    handleSortChange;
                  }}
                  className={styles.toggleButton}
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
                  onClick={() => {
                    setBadgesSelected(false);
                    setSortMode("newest");
                    handleSortChange;
                  }}
                  className={styles.toggleButton}
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
                  onChange={handleSortChange}
                  size="small"
                  sx={{
                    ...whiteSelectGrayBorder,
                    width: "100%",
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
            {loading ? (
              <Loading />
            ) : (
              <>
                {badgesSelected ? (
                  <>
                    {correlatedPathways.length == 0 ? (
                      <>
                        <div className={styles.noCards}>
                          <h1>No Badges Earned!</h1>
                          <div className={styles.leftButtonContainer}>
                            <Button
                              onClick={() => {
                                navigate("/pathways");
                              }}
                              sx={forestGreenButtonPadding}
                              variant="contained"
                            >
                              Go to Pathways Library
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div className={styles.cardsContainer}>
                      {correlatedPathways.map((pathway, index) => (
                        <Badge
                          title={pathway.genericPathway.name}
                          date={pathway.volunteerPathway.dateCompleted}
                          image={pathway.genericPathway.badgeImage}
                          key={index}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {correlatedTrainings.length == 0 ? (
                      <>
                        <div className={styles.noCards}>
                          <h1>No Certifications Earned!</h1>
                          <div className={styles.leftButtonContainer}>
                            <Button
                              onClick={() => {
                                navigate("/trainings");
                              }}
                              sx={forestGreenButtonPadding}
                              variant="contained"
                            >
                              Go to Trainings Library
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.cardsContainer}>
                          {correlatedTrainings.map((training, index) => (
                            <Certificate
                              title={training.genericTraining.name}
                              image={training.genericTraining.coverImage}
                              date={training.volunteerTraining.dateCompleted}
                              key={index}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AchievementsPage;

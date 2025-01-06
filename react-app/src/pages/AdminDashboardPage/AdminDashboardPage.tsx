import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar";
import styles from "./AdminDashboardPage.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";
import AdminTrainingCard from "../../components/AdminTrainingCard/AdminTrainingCard";
import AdminPathwayCard from "../../components/AdminPathwayCard/AdminPathwayCard";
import Loading from "../../components/LoadingScreen/Loading";
import { TrainingID } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType";
import { Button, FormControl, Select, MenuItem } from "@mui/material";
import {
  forestGreenButtonPadding,
  forestGreenButtonLarge,
  whiteButtonGrayBorder,
  whiteSelectGrayBorder,
  selectOptionStyle,
} from "../../muiTheme";
import { getAllPathways, getAllTrainings } from "../../backend/FirestoreCalls";
import hamburger from "../../assets/hamburger.svg";

function AdminDashboardPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [filterType, setFilterType] = useState("trainings");
  const [trainingDrafts, setTrainingDrafts] = useState<TrainingID[]>([]);
  const [trainingsPublished, setTrainingsPublished] = useState<TrainingID[]>(
    []
  );
  const [pathwayDrafts, setPathwayDrafts] = useState<PathwayID[]>([]);
  const [pathwaysPublished, setPathwaysPublished] = useState<PathwayID[]>([]);

  const correlateTrainings = (genericTrainings: TrainingID[]) => {
    const trainingsDrafts: TrainingID[] = [];
    const trainingsPublished: TrainingID[] = [];

    for (const genericTraining of genericTrainings) {
      if (genericTraining.status == "DRAFT") {
        trainingsDrafts.push(genericTraining);
      } else if (genericTraining.status == "PUBLISHED") {
        trainingsPublished.push(genericTraining);
      }
    }

    setTrainingDrafts(trainingsDrafts);
    setTrainingsPublished(trainingsPublished);
  };

  const correlatePathways = (genericPathways: PathwayID[]) => {
    const pathwayDrafts: PathwayID[] = [];
    const pathwaysPublished: PathwayID[] = [];

    for (const genericPathway of genericPathways) {
      if (genericPathway.status == "DRAFT") {
        pathwayDrafts.push(genericPathway);
      } else if (genericPathway.status == "PUBLISHED") {
        pathwaysPublished.push(genericPathway);
      }
    }

    setPathwayDrafts(pathwayDrafts);
    setPathwaysPublished(pathwaysPublished);
  };
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  function displayPathwayItems(pathwayList: PathwayID[]): PathwayID[] {
    if (screenWidth < 450) {
      return pathwayList.slice(0, 1);
    } else if (screenWidth > 1500) {
      return pathwayList.slice(0, 2);
    } else if (screenWidth > 1000) {
      return pathwayList.slice(0, 2);
    }
    return pathwayList.slice(0, 1);
  }

  function displayTrainingItems(trainingList: TrainingID[]): TrainingID[] {
    if (screenWidth < 450) {
      return trainingList.slice(0, 1);
    } else if (screenWidth < 750) {
      return trainingList.slice(0, 1);
    } else if (screenWidth > 1500) {
      return trainingList.slice(0, 4);
    } else if (screenWidth > 1000) {
      return trainingList.slice(0, 3);
    }
    return trainingList.slice(0, 2);
  }

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
    if (!auth.loading && auth.id) {
      getAllTrainings()
        .then((genericTrainings) => {
          // function to sort
          correlateTrainings(genericTrainings);
        })
        .catch((error) => {
          console.error("Error fetching trainings:", error);
        });

      getAllPathways()
        .then((genericPathways) => {
          correlatePathways(genericPathways);
        })
        .catch((error) => {
          console.error("Error fetching pathways:", error);
        });

      setLoading(false);
    }
  }, [auth.loading, auth.id]);

  return (
    <>
      <AdminNavigationBar
        open={navigationBarOpen}
        setOpen={setNavigationBarOpen}
      />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}>
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
              <h1 className={styles.nameHeading}>Hello, {auth.firstName}!</h1>
              <ProfileIcon />
            </div>

            <div className={styles.buttonContainer}>
              <Button
                sx={forestGreenButtonLarge}
                variant="contained"
                onClick={() => navigate("/trainings/editor")}>
                CREATE NEW TRAINING
              </Button>
              <Button
                sx={forestGreenButtonLarge}
                variant="contained"
                onClick={() => navigate("/pathways/editor")}>
                CREATE NEW PATHWAY
              </Button>
            </div>
            <div className={styles.buttonSelect}>
              <Button
                onClick={() => setFilterType("trainings")}
                sx={
                  filterType === "trainings"
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained">
                TRAINING
              </Button>
              <Button
                onClick={() => setFilterType("pathways")}
                sx={
                  filterType === "pathways"
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained">
                PATHWAYS
              </Button>
            </div>
            <div className={styles.dropdownContainer}>
              <FormControl sx={{ width: 300 }}>
                <Select
                  className={styles.dropdownMenu}
                  sx={whiteSelectGrayBorder}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)} // Handle the dropdown value directly
                  displayEmpty
                  label="Filter">
                  <MenuItem value="trainings" sx={selectOptionStyle}>
                    TRAININGS
                  </MenuItem>
                  <MenuItem value="pathways" sx={selectOptionStyle}>
                    PATHWAYS
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {loading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : (
              <>
                <div className={styles.subHeader}>
                  <h2>Current Drafts</h2>
                </div>
                {filterType === "trainings" ? (
                  <>
                    {trainingDrafts.length === 0 ? (
                      <div className={styles.subHeader}>
                        No drafted trainings
                      </div>
                    ) : (
                      <div className={styles.cardsContainer}>
                        {displayTrainingItems(trainingDrafts).map(
                          (training, index) => (
                            <AdminTrainingCard
                              training={training}
                              key={index}
                            />
                          )
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {pathwayDrafts.length === 0 ? (
                      <div className={styles.subHeader}>
                        No drafted pathways
                      </div>
                    ) : (
                      <div className={styles.cardsContainer}>
                        {displayPathwayItems(pathwayDrafts).map(
                          (pathway, index) => (
                            <AdminPathwayCard pathway={pathway} key={index} />
                          )
                        )}
                      </div>
                    )}
                  </>
                )}
                <div className={styles.subHeader}>
                  <h2>Published</h2>
                </div>
                {filterType === "trainings" ? (
                  <>
                    {trainingsPublished.length === 0 ? (
                      <div className={styles.subHeader}>
                        No published trainings
                      </div>
                    ) : (
                      <div className={styles.cardsContainer}>
                        {displayTrainingItems(trainingsPublished).map(
                          (training, index) => (
                            <AdminTrainingCard
                              training={training}
                              key={index}
                            />
                          )
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {pathwaysPublished.length === 0 ? (
                      <div className={styles.subHeader}>
                        No published pathways
                      </div>
                    ) : (
                      <div className={styles.cardsContainer}>
                        {displayPathwayItems(pathwaysPublished).map(
                          (pathway, index) => (
                            <AdminPathwayCard pathway={pathway} key={index} />
                          )
                        )}
                      </div>
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

export default AdminDashboardPage;

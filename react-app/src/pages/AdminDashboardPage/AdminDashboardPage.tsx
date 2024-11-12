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
import { Button } from "@mui/material";
import {
  forestGreenButtonPadding,
  forestGreenButtonLarge,
  whiteButtonGrayBorder,
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
  const [trainingsSelected, setTrainingsSelected] = useState<boolean>(true);
  const [trainingDrafts, setTrainingDrafts] = useState<TrainingID[]>([]);
  const [trainingsPublished, setTrainingsPublished] = useState<TrainingID[]>(
    []
  );
  const [pathwayDrafts, setPathwayDrafts] = useState<PathwayID[]>([]);
  const [pathwaysPublished, setPathwaysPublished] = useState<PathwayID[]>([]);

  const correlateTrainings = (genericTrainings: TrainingID[]) => {
    let trainingsDrafts: TrainingID[] = [];
    let trainingsPublished: TrainingID[] = [];

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
    let pathwayDrafts: PathwayID[] = [];
    let pathwaysPublished: PathwayID[] = [];

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
              <h1 className={styles.nameHeading}>Hello, {auth.firstName}!</h1>
              <ProfileIcon />
            </div>

            <div className={styles.buttonContainer}>
              <Button
                sx={forestGreenButtonLarge}
                variant="contained"
                onClick={() => navigate("/admin/trainings/editor")}
              >
                CREATE NEW TRAINING
              </Button>
              <Button sx={forestGreenButtonLarge} variant="contained">
                CREATE NEW PATHWAY
              </Button>
            </div>
            <div className={styles.buttonSelect}>
              <Button
                onClick={() => setTrainingsSelected(true)}
                sx={
                  trainingsSelected
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained"
              >
                TRAINING
              </Button>
              <Button
                onClick={() => setTrainingsSelected(false)}
                sx={
                  !trainingsSelected
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained"
              >
                PATHWAYS
              </Button>
            </div>
            {loading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : (
              <>
                <div className={styles.subHeader}>
                  <h2>Recent Drafts</h2>
                </div>
                {trainingsSelected ? (
                  <>
                    {trainingDrafts.length === 0 && (
                      <div className={styles.subHeader}>lmao u flopped!</div>
                    )}
                    {trainingDrafts.length > 0 && (
                      <div className={styles.cardsContainer}>
                        {trainingDrafts.slice(0, 3).map((training, index) => (
                          <AdminTrainingCard training={training} key={index} />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {pathwayDrafts.length > 0 && (
                      <div className={styles.cardsContainer}>
                        {pathwayDrafts.slice(0, 2).map((pathway, index) => (
                          <AdminPathwayCard pathway={pathway} key={index} />
                        ))}
                      </div>
                    )}
                  </>
                )}
                <div className={styles.subHeader}>
                  <h2>Recent Published</h2>
                </div>
                {trainingsSelected ? (
                  <>
                    {trainingsPublished.length > 0 && (
                      <div className={styles.cardsContainer}>
                        {trainingsPublished
                          .slice(0, 3)
                          .map((training, index) => (
                            <AdminTrainingCard
                              training={training}
                              key={index}
                            />
                          ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {pathwaysPublished.length > 0 && (
                      <div className={styles.cardsContainer}>
                        {pathwaysPublished.slice(0, 2).map((pathway, index) => (
                          <AdminPathwayCard pathway={pathway} key={index} />
                        ))}
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

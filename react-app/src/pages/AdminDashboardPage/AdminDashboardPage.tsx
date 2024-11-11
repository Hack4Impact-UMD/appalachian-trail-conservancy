import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import styles from "./AdminDashboardPage.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";
import AdminTrainingCard from "../../components/AdminTrainingCard/AdminTrainingCard";
import AdminPathwayCard from "../../components/AdminPathwayCard/AdminPathwayCard";
import { TrainingID } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType";
import { Button } from "@mui/material";
import {
  forestGreenButtonPadding,
  forestGreenButtonLarge,
  whiteButtonGrayBorder,
} from "../../muiTheme";
import { getAllTrainings, getAllPathways } from "../../backend/FirestoreCalls";

function AdminDashboardPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [trainingsSelected, setTrainingsSelected] = useState<boolean>(true);
  const [draftTrainings, setDraftTrainings] = useState<TrainingID[]>([]);
  const [publishedTrainings, setPublishedTrainings] = useState<TrainingID[]>([]);
  const [draftPathways, setDraftPathways] = useState<PathwayID[]>([]);
  const [publishedPathways, setPublishedPathways] = useState<PathwayID[]>([]);

  // Fetch training data on component mount
  useEffect(() => {
    getAllTrainings()
      .then((trainings) => {
        // Filter trainings into drafts and published
        setDraftTrainings(trainings.filter((training) => training.status === "DRAFT"));
        setPublishedTrainings(trainings.filter((training) => training.status === "PUBLISHED"));
      })
      .catch((error) => {
        console.error("Error fetching trainings:", error);
      });
  }, []);

  // Fetch pathway data on component mount
  useEffect(() => {
    getAllPathways()
      .then((pathways) => {
        // Filter trainings into drafts and published
        setDraftPathways(pathways.filter((pathway) => pathway.status === "DRAFT"));
        setPublishedPathways(pathways.filter((pathway) => pathway.status === "PUBLISHED"));
      })
      .catch((error) => {
        console.error("Error fetching pathways:", error);
      });
  }, []);

  const handleCreateTraining = () => {
    navigate("/admin/trainings/editor", { });
  };

  const handleEditTraining = (training: TrainingID) => {
    navigate("/admin/trainings/editor", { state: { training } });
  };

  const handleEditPathway = (pathway: PathwayID) => {
    navigate("/admin/pathways/editor", { state: { pathway } });
  };

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
              <h1 className={styles.nameHeading}>Hello, {auth.firstName}!</h1>
              <div className={styles.adminIcon}>
                <h6> ADMIN </h6>
                <div className={styles.profileIcon}>
                  <ProfileIcon />
                </div>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <Button sx={forestGreenButtonLarge} variant="contained" onClick={() => handleCreateTraining()}>
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

            {/* Display Recent Drafts */}
            <div className={styles.subHeader}>
              <h2>Recent Drafts</h2>
            </div>
            {trainingsSelected ? (
              <>
                <div className={styles.cardsContainer}>
                  {draftTrainings.slice(0, 3).map((training) => (
                    <AdminTrainingCard key={training.id} training={training} onEdit={() => handleEditTraining(training)} />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className={styles.cardsContainer}>
                  {draftPathways.slice(0, 2).map((pathway) => (
                    <AdminPathwayCard key={pathway.id} pathway={pathway} onEdit={() => handleEditPathway(pathway)} />
                  ))}
                </div>
              </>
            )}

            <div className={styles.subHeader}>
              <h2>Recent Published</h2>
            </div>
            {trainingsSelected ? (
              <>
                <div className={styles.cardsContainer}>
                  {publishedTrainings.slice(0, 3).map((training) => (
                    <AdminTrainingCard key={training.id} training={training} onEdit={() => handleEditTraining(training)} />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className={styles.cardsContainer}>
                  {publishedPathways.slice(0, 2).map((pathway) => (
                    <AdminPathwayCard key={pathway.id} pathway={pathway} onEdit={() => handleEditPathway(pathway)} />
                  ))}
                </div>
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

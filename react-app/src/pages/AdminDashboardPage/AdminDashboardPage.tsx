import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
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

function AdminDashboardPage() {
  const auth = useAuth();
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [trainingsSelected, setTrainingsSelected] = useState<boolean>(true);
  const [training] = useState<TrainingID>({
    name: "Introduction to Cooperation",
    id: "123",
    shortBlurb: "",
    description: "",
    coverImage:
      "https://i0.wp.com/www.oxfordstudent.com/wp-content/uploads/2018/11/Spongebob-2.png?fit=770%2C433&ssl=1",
    resources: [],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    associatedPathways: [],
    certificationImage: "",
    status: "DRAFT",
  });

  const [pathway] = useState<PathwayID>({
    name: "Test Pathway",
    id: "",
    shortBlurb: "",
    description: "",
    coverImage: "",
    trainingIDs: [],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    badgeImage: "",
    status: "DRAFT",
  });

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}>
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Hello, {auth.firstName}!</h1>
              <ProfileIcon />
            </div>
            <div className={styles.buttonContainer}>
              <Button sx={forestGreenButtonLarge} variant="contained">
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
                variant="contained">
                TRAINING
              </Button>
              <Button
                onClick={() => setTrainingsSelected(false)}
                sx={
                  !trainingsSelected
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained">
                PATHWAYS
              </Button>
            </div>
            <div className={styles.subHeader}>
              <h2>Recent Drafts</h2>
            </div>
            {trainingsSelected ? (
              <>
                <div className={styles.cardsContainer}>
                  <AdminTrainingCard training={training} />
                  <AdminTrainingCard training={training} />
                  <AdminTrainingCard training={training} />
                  <AdminTrainingCard training={training} />
                </div>
              </>
            ) : (
              <>
                <div className={styles.cardsContainer}>
                  <AdminPathwayCard pathway={pathway} />
                  <AdminPathwayCard pathway={pathway} />
                  <AdminPathwayCard pathway={pathway} />
                </div>
              </>
            )}

            <div className={styles.subHeader}>
              <h2>Recent Published</h2>
            </div>
            {trainingsSelected ? (
              <>
                <div className={styles.cardsContainer}>
                  <AdminTrainingCard training={training} />
                  <AdminTrainingCard training={training} />
                  <AdminTrainingCard training={training} />
                </div>
              </>
            ) : (
              <>
                <div className={styles.cardsContainer}>
                  <AdminPathwayCard pathway={pathway} />
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

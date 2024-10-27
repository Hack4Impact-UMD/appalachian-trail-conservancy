import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { whiteButtonGrayBorder, forestGreenButton } from "../../muiTheme";
import { TrainingID } from "../../types/TrainingType";
import { VolunteerTraining } from "../../types/UserType";
import { updateVolunteerTraining } from "../../backend/FirestoreCalls";
import styles from "./TrainingPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import ResourceComponent from "../../components/ResourceComponent/ResourceComponent";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import hamburger from "../../assets/hamburger.svg";

function TrainingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [volunteerId, setVolunteerId] = useState("");
  const [volunteerTraining, setVolunteerTraining] = useState<VolunteerTraining>(
    {
      trainingID: "",
      progress: "INPROGRESS",
      dateCompleted: "0000-00-00",
      numCompletedResources: 0,
      numTotalResources: 0,
    }
  );
  const [training, setTraining] = useState<TrainingID>({
    name: "",
    id: "",
    shortBlurb: "",
    description: "",
    coverImage: "",
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

  useEffect(() => {
    // Get data from navigation state
    if (
      location.state?.fromApp &&
      location.state.training &&
      location.state.volunteerTraining &&
      location.state.volunteerId
    ) {
      setTraining(location.state.training);
      setVolunteerTraining(location.state.volunteerTraining);
      setLoading(false);
      setVolunteerId(location.state.volunteerId);
    } else {
      navigate("/trainings");
    }
  }, []);

  const handleContinueButton = async () => {
    if (stepIndex < training.resources.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      navigate(`/trainings/quizlanding`, {
        state: {
          training: training,
          volunteerTraining: volunteerTraining,
          fromApp: true,
          from: location,
        },
      });
    }
    if (stepIndex == volunteerTraining.numCompletedResources) {
      try {
        const updatedVolunteerTraining = {
          ...volunteerTraining,
          numCompletedResources: volunteerTraining.numCompletedResources + 1,
        };

        // Update the state
        setVolunteerTraining(updatedVolunteerTraining);

        // Call updateTraining to update the database
        await updateVolunteerTraining(volunteerId, updatedVolunteerTraining);
      } catch (error) {
        console.error("Error updating training:", error);
      }
    }
  };

  // TODO: Only resources after the first should show a back button
  const handleBackButton = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else {
      //TODO: Quiz
      navigate(`/trainings/${training.id}`, {
        state: {
          training: training,
          volunteerTraining: volunteerTraining,
          fromApp: true,
        },
      });
    }
  };

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
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
          <div className={styles.bodyContainer}>
            {/* HEADER */}
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>{training.name}</h1>
              <ProfileIcon />
            </div>

            {loading ? (
              <Loading />
            ) : (
              <ResourceComponent resource={training.resources[stepIndex]} />
            )}
          </div>
        </div>

        {/* footer */}
        <div
          className={styles.footer}
          style={{ width: navigationBarOpen ? "calc(100% - 250px)" : "100%" }}
        >
          <div className={styles.footerButtons}>
            <Button
              sx={whiteButtonGrayBorder}
              onClick={() => handleBackButton()}
              variant="contained"
            >
              Back
            </Button>
            <Button
              sx={forestGreenButton}
              onClick={() => handleContinueButton()}
              variant="contained"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrainingPage;

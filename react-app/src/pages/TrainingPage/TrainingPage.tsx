import { useState, useEffect } from "react";
import { stepperStyle } from "../../muiTheme";
import { TrainingID } from "../../types/TrainingType";
import {
  useLocation,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import styles from "./TrainingPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ResourceComponent from "../../components/ResourceComponent/ResourceComponent";
import { type VolunteerTraining } from "../../types/UserType";

function TrainingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [stepIndex, setStepIndex] = useState(0);
  const [volunteerTraining, setVolunteerTraining] =
    useState<VolunteerTraining>();
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
  });

  useEffect(() => {
    // Get data from navigation state
    if (
      location.state?.fromApp &&
      location.state.training &&
      location.state.volunteerTraining
    ) {
      setTraining(location.state.training);
      setVolunteerTraining(location.state.volunteerTraining);
    } else {
      navigate("/trainings");
    }
  }, []);

  // TODO: The last resource should show "start quiz" button
  // or confirmation
  const handleContinueButton = () => {
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
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.outerContainer}>
          <div className={styles.bodyContainer}>
            {/* HEADER */}
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>{training.name}</h1>
              <ProfileIcon />
            </div>

            <ResourceComponent
              handleBackButton={handleBackButton}
              handleContinueButton={handleContinueButton}
              resource={training.resources[stepIndex]}
            />
          </div>
        </div>

        {/* Stepper */}
        <Stepper
          activeStep={stepIndex}
          className={styles.stepContainer}
          sx={stepperStyle}>
          {training.resources.map((resource, idx) => (
            <Step key={idx} sx={{ padding: "0" }}>
              <StepLabel
                sx={{
                  ".MuiStepIcon-text": { display: "none" },
                }}
              />
            </Step>
          ))}
        </Stepper>
      </div>
    </>
  );
}

export default TrainingPage;

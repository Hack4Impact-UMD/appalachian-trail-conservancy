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
import { getTraining } from "../../backend/FirestoreCalls";
import { type VolunteerTraining } from "../../types/UserType";

function TrainingPage() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);

  const location = useLocation();
  const trainingId = useParams().id;

  const [loading, setLoading] = useState<boolean>(true);

  const [volunteerTraining, setVolunteerTraining] = useState<VolunteerTraining>(
    {
      trainingID: "GQf4rBgvJ4uU9Is89wXp",
      progress: "COMPLETED",
      dateCompleted: "",
      numCompletedResources: 4,
      numTotalResources: 4,
      quizScoreRecieved: 0,
    }
  );

  const [training, setTraining] = useState<TrainingID>({
    name: "How to pet a cat",
    id: "1233",
    shortBlurb: "",
    description: "blah blah blah",
    coverImage: "",
    resources: [
      { type: "VIDEO", link: "https://example.com/video1", title: "Video 1" },
      { type: "PDF", link: "https://example.com/article1", title: "Article 1" },
      { type: "PDF", link: "https://example.com/article1", title: "Article 2" },
      { type: "PDF", link: "https://example.com/article1", title: "Article 3" },
    ],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    associatedPathways: [],
    certificationImage: "",
  });

  useEffect(() => {
    if (
      !location.state ||
      (!location.state.training && !location.state.volunteerTraining)
    ) {
      // Fetch data only if trainingId is available
      if (trainingId !== undefined) {
        getTraining(trainingId)
          .then((trainingData) => {
            setTraining(trainingData);
          })
          .catch(() => {
            console.log("Failed to get training");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      // Update state with data from location's state
      if (location.state.training) {
        setTraining(location.state.training);
      }
      if (location.state.volunteerTraining) {
        setVolunteerTraining(location.state.volunteerTraining);
      }
      setLoading(false);
    }
  }, [trainingId, location.state]);

  if (!location.state?.fromApp) {
    return <Navigate to="/trainings" />;
  }

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
          sx={stepperStyle}
        >
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

import { useState } from "react";
import { stepperStyle } from "../../muiTheme";
import { TrainingResource } from "../../types/TrainingType";
import styles from "./TrainingPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ResourceComponent from "../../components/ResourceComponent/ResourceComponent";
import LogoutPopup from "../../components/LogoutPopup/LogoutPopup";

const resources: TrainingResource[] = [
  {
    type: "VIDEO",
    link: "https://www.youtube.com/embed/Cvn96VkhbjE?si=ySyjq6tCmBlqPpT7",
    title: "SpongeBob Employee",
  },
  {
    type: "PDF",
    link: "https://bayes.wustl.edu/etj/articles/random.pdf",
    title: "Random Observations",
  },
  {
    type: "VIDEO",
    link: "https://youtube.com/embed/R4qDveKoGvA?si=z7CHAnRgu5TPMWpt",
    title: "Campfire Song",
  },
  {
    type: "PDF",
    link: "https://philpapers.org/archive/DOROIO.pdf",
    title: "Being Rational and Being Wrong",
  },
];

function TrainingPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [openLogoutPopup, setOpenLogoutPopup] = useState<boolean>(false);

  // TODO: The last resource should show "start quiz" button
  // or confirmation
  const handleContinueButton = () => {
    if (stepIndex < resources.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      //TODO: Quiz
    }
  };

  // TODO: Only resources after the first should show a back button
  const handleBackButton = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else {
      //TODO: Quiz
    }
  };

  return (
    <>
      <NavigationBar/>
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.bodyContainer}>
          {/* HEADER */}
          <div className={styles.header}>
            <h1 className={styles.nameHeading}>Training Title</h1>
            <ProfileIcon />
          </div>

          <ResourceComponent
            handleBackButton={handleBackButton}
            handleContinueButton={handleContinueButton}
            resource={resources[stepIndex]}
          />
        </div>

        {/* Stepper */}
        <Stepper
          activeStep={stepIndex}
          className={styles.stepContainer}
          sx={stepperStyle}>
          {resources.map((resource, idx) => (
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
      <div>
        <LogoutPopup 
          open={openLogoutPopup} 
          onClose={setOpenLogoutPopup} 
        />
      </div>
    </>
  );
}

export default TrainingPage;

import { useState } from "react";
import { stepperStyle, whiteButtonGrayBorder } from "../../muiTheme";
import { TrainingResource } from "../../types/TrainingType";
import styles from "./TrainingLandingPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ResourceComponent from "../../components/ResourceComponent/ResourceComponent";
import LinearProgressWithLabel from "../../components/LinearProgressWithLabel/LinearProgressWithLabel";
import { type Training } from '../../types/TrainingType';
import { type VolunteerTraining } from '../../types/UserType';
import { Button } from "@mui/material";
import { forestGreenButton } from "../../muiTheme";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

const styledButtons = {
  marginRight: '10%',
  marginLeft: '1%',
};

const isCompleted = (volunteer: VolunteerTraining): boolean => {
  return volunteer.numCompletedResources === volunteer.numTotalResources;
};

function TrainingLandingPage() {
  const volunteer: VolunteerTraining = {
    trainingID: '',
    progress: 'INPROGRESS',
    dateCompleted: '',
    numCompletedResources: 2,
    numTotalResources: 2,
    quizScoreRecieved: 0,
  };

  const training: Training = {
    name: 'How to pet a cat',
    description: 'blah blah blah',
    coverImage: '',
    resources: [
      { type: 'VIDEO', link: 'https://example.com/video1', title: 'Video 1' },
      { type: 'PDF', link: 'https://example.com/article1', title: 'Article 1' },
    ],
    quizID: '',
    associatedPathways: [],
    certificationImage: '',
  };

  const renderTrainingResources = () => {
    return training.resources.map((resource: TrainingResource, index: number) => (
      <div key={index}>
        <div className={styles.trainingRow}>
          <div className={styles.trainingInfo}>
            <p className={styles.trainingNumber}>{index + 1}</p>
            <p className={styles.trainingTitle}>{resource.title}</p>
            <p className={styles.trainingType}>{resource.type}</p>
          </div>
          {/* Conditionally render an image if training is completed */}
          {isCompleted(volunteer) && (
            <div className={styles.completedIcon}>
              <img src="/path/to/completed-icon.png" alt="Completed" className={styles.completedIconImage} />
            </div>
          )}
        </div>
      </div>
    ));
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

            <div className={styles.progressBarContainer}>
              <LinearProgressWithLabel value={(volunteer.numCompletedResources / volunteer.numTotalResources) * 100} />
              <div className={`${styles.marker} ${styles.notStartedMarker}`}>NOT STARTED</div>
            </div>

            {/* ABOUT */}
            <div className={styles.container}>
              <h2>About</h2>
              <p>{training.description}</p>
            </div>

            {/* OVERVIEW */}
            <div className={styles.container}>
              <h2>Overview</h2>
              {renderTrainingResources()}
              <div className={styles.trainingRowFinal}>
                <div className={styles.trainingInfo}>
                  <p className={styles.trainingNumber}>{volunteer.numCompletedResources + 1}</p>
                  <p className={styles.trainingTitle}>Quiz</p>
                </div>
                </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className={styles.footer}>
          <Button sx={{ ...whiteButtonGrayBorder, }} variant="contained">
            Back
          </Button>
          <Button sx={{ ...forestGreenButton, ...styledButtons }} variant="contained">
            Start
          </Button>
        </div>
      </div>
    </>
  );
}

export default TrainingLandingPage;

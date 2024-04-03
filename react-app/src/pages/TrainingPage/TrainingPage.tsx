import styles from "./TrainingPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import VideoComponent from "../../components/VideoComponent/VideoComponent";
import PDFComponent from "../../components/PDFComponent/PDFComponent";
import { TrainingResource } from "../../types/TrainingType";

const steps = ["", "", "", ""];
const resources: TrainingResource[] = [
  {
    type: "VIDEO",
    link: "https://www.youtube.com/embed/Cvn96VkhbjE?si=ySyjq6tCmBlqPpT7",
    title: "SpongeBob Employee",
  },
  {
    type: "PDF",
    link: "https://bayes.wustl.edu/etj/articles/random.pdf",
    title: "Random PDF",
  },
  {
    type: "VIDEO",
    link: "https://youtube.com/embed/R4qDveKoGvA?si=z7CHAnRgu5TPMWpt",
    title: "Campfire Song",
  },
];

function TrainingPage() {
  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.nameHeading}>Training Title</h1>
          <ProfileIcon />
        </div>

        {/* CONTENT SECTION */}
        <div className={styles.contentContainer}>
          <VideoComponent url={resources[2].link} title={resources[0].title} />
        </div>

        {/* Stepper */}
        <div className={styles.stepContainer}>
          <Stepper activeStep={0} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>
    </>
  );
}

export default TrainingPage;

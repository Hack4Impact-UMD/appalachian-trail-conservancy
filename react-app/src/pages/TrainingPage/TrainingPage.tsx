import styles from "./TrainingPage.module.css";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import VideoComponent from "../../components/VideoComponent/VideoComponent";
import PDFComponent from "../../components/PDFComponent/PDFComponent";

const steps = ["", "", "", ""];

function TrainingPage() {
  return (
    <>
      <div className={`${styles.split} ${styles.left}`}></div>
      <div className={`${styles.split} ${styles.right}`}>
        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.nameHeading}>Training Title</h1>
          <div className={styles.imgContainer}>
            <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
          </div>
        </div>

          {/* CONTENT SECTION */}
          <div className={styles.contentContainer}>
            <VideoComponent url={"https://www.youtube.com/embed/Cvn96VkhbjE?si=ySyjq6tCmBlqPpT7"} title={"SpongeBob Employee"} />
          </div>
          {/*<div className={styles.contentContainer}>
            <PDFComponent url={"https://https://www.vims.edu/cbnerr/_docs/discovery_labs/SpongeBob.pdf"} title={"SpongeBob Employee"} />
        </div>*/}

        {/* FOOTER */}
        <div className={styles.stepContainer}>
            <Box sx={{ width: "100%" }}>
              <Stepper activeStep={0} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
        </div>

      </div>
    </>
  );
}

export default TrainingPage;

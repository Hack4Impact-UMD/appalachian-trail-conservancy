import * as React from "react";
import Certificate from "../../components/CertificateCard/Certificate.tsx";
import TrainingCard from "../../components/TrainingCard/Training.tsx";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "./TrainingsCompletedPage.module.css";

const TrainingsCompletedPage = () => {
  return (
    <div className={styles.split}>
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.rightBox}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}> Trainings Completed</h1>
            <img
              src={
                "https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg"
              }
              className={styles.profilePicture}
            ></img>
          </div>
          <div className={styles.certificateSection}>
            <div className={styles.certificateCards}>
              <Certificate
                image=""
                title="Certificate Title"
                date="MONTH 00, 0000"
              />
            </div>
            <div className={styles.certificateCards}>
              <Certificate
                image="path_to_your_image.jpg"
                title="Certificate Title"
                date="MONTH 00, 0000"
              />
            </div>
            <div className={styles.certificateCards}>
              <Certificate
                image="path_to_your_image.jpg"
                title="Certificate Title"
                date="MONTH 00, 0000"
              />
            </div>
            <div className={styles.certificateCards}>
              <Certificate
                image="path_to_your_image.jpg"
                title="Certificate Title"
                date="MONTH 00, 0000"
              />
            </div>
            <div className={styles.certificateCards}>
              <Certificate
                image="path_to_your_image.jpg"
                title="Certificate Title"
                date="MONTH 00, 0000"
              />
            </div>
            <div className={styles.certificateCards}>
              <Certificate
                image="path_to_your_image.jpg"
                title="Certificate Title"
                date="MONTH 00, 0000"
              />
            </div>
          </div>
          <div>
            <h1> Recommended </h1>
          </div>
          <div className={styles.recommendSection}>
            <div className={styles.TrainingCard}>
              <TrainingCard
                image="another_image.jpg"
                title="Another Training Task"
                subtitle="Another Subtitle"
              />
            </div>
            <div className={styles.TrainingCard}>
              <TrainingCard
                image="another_image.jpg"
                title="Another Training Task"
                subtitle="Another Subtitle"
              />
            </div>
            <div className={styles.TrainingCard}>
              <TrainingCard
                image="another_image.jpg"
                title="Another Training Task"
                subtitle="Another Subtitle"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingsCompletedPage;

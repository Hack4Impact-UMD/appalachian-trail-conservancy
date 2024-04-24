import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Link } from "react-router-dom";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import PathwayCard from "../../components/PathwayCard/PathwayCard";
import styles from "./QuizLandingPage.module.css";
import Certificate from "../../components/CertificateCard/CertificateCard";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import TrainingPopup from "../../components/TrainingPopup/TrainingPopup";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";
import { DateTime } from "luxon";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

function QuizLandingPage() {
  const testDefaultQuiz = {
    id: "5",
    trainingID: "5",
    questions: [],
    numQuestions: 10,
    passingScore: 10,
  };
  const testDefaultTrainingResource = {
    type: "quiz",
    id: "5",
    title: "Training Title - Quiz",
  };

  const testDefaultTraining = {
    trainingID: "id",
    progress: "50",
    dateCompleted: "2024-04-20",
    numCompletedResources: 0,
    numTotalResources: 0,
    quizScoreRecieved: 0,
  };

  const parsedDate = DateTime.fromISO(testDefaultTraining.dateCompleted);
  const formattedDate = parsedDate.toFormat("MMMM dd, yyyy").toUpperCase();

  // const [trainingTitle, setTrainingTitle] = useState("Training Title - Quiz");
  // const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  // const [passingScore, setPassingScore] = useState("10/10");
  // const [lastAttempt, setLastAttempt] = useState(null);

  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.nameHeading}>
              {" "}
              {testDefaultTrainingResource.title}{" "}
            </h1>
            <ProfileIcon />
          </div>
          <div className={styles.subHeader}>
            <h2>Number of Questions: {testDefaultQuiz.numQuestions} </h2>
            <h2>Passing Score: {testDefaultQuiz.passingScore}</h2>
          </div>
          <div className={styles.instructionsTitle}>
            <h2>Instructions</h2>
          </div>
          <div className={styles.instructionContent}>
            <p>
              Instruction text goes right here and we can explain what to do
              right here yay
            </p>
          </div>
          <div className={styles.subHeader}>
            <h2>Best Attempt</h2>
          </div>
          {null === null ? (
            <>
              <div className={styles.noAttemptContainer}>
                <p>No Recent Attempt</p>
              </div>
            </>
          ) : testDefaultTraining.quizScoreRecieved >=
            testDefaultQuiz.passingScore ? (
            <>
              <div className={styles.passedAttemptContainer}>
                <div className={styles.leftContent}>
                  <span className={styles.dateText}>{formattedDate}</span>
                  <span>{testDefaultTraining.quizScoreRecieved}/{testDefaultQuiz.numQuestions}</span>
                </div>
                <div className={styles.rightContent}>
                  Passed! <FaCheck />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.failedAttemptContainer}>
                <div className={styles.leftContent}>
                  <span className={styles.dateText}>{formattedDate}</span>
                  <span>{testDefaultTraining.quizScoreRecieved}/{testDefaultQuiz.numQuestions}</span>
                </div>
                <div className={styles.rightContent}>
                  Did Not Pass <FaXmark />
                </div>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

{
  /* <div className={styles.attemptContainer}>
            <div className={styles.date}>
              <p>April 11, 2024</p>
            </div>
            <div className={styles.score}>
              <p>10/10</p>
            </div>
            <div className={styles.result}>
              <p>
                Passed! <FaCheck />
              </p>
            </div>
          </div> */
}

export default QuizLandingPage;

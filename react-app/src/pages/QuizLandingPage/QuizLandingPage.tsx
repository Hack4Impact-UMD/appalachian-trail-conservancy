import { useState } from "react";
import { Button } from "@mui/material";
import { forestGreenButton, whiteButtonGrayBorder } from "../../muiTheme";
import { useLocation, Navigate } from "react-router-dom";
import { DateTime } from "luxon";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { Training } from "../../types/TrainingType";
import { type VolunteerTraining } from "../../types/UserType";
import styles from "./QuizLandingPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

function QuizLandingPage() {
  const [volunteerTraining, setVolunteerTraining] = useState<VolunteerTraining>(
    {
      trainingID: "GQf4rBgvJ4uU9Is89wXp",
      progress: "COMPLETED",
      dateCompleted: "2024-04-12",
      numCompletedResources: 4,
      numTotalResources: 4,
      quizScoreRecieved: 1, // field would not exist if user has never taken quiz
    }
  );

  // This training should represent the current training corresponding to the current quiz
  // This data should be recieved from navigation state
  const [training, setTraining] = useState<Training>({
    name: "How to pet a cat",
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
      questions: [
        {
          question: "How many toes do feet normally have?",
          choices: ["20", "10", "2", "3"],
          answer: "10",
        },
        {
          question: "How many compressions should you do when performing CPR?",
          choices: [
            "100000",
            "3",
            "30",
            "Do not do any compressions and just breathe",
          ],
          answer: "30",
        },
      ],
      numQuestions: 2,
      passingScore: 1,
    },
    associatedPathways: [],
    certificationImage: "",
  });

  const location = useLocation();

  if (!location.state?.fromApp) {
    return <Navigate to="/trainings" />;
  }

  const parsedDate = DateTime.fromISO(volunteerTraining.dateCompleted);
  const formattedDate = parsedDate.toFormat("MMMM dd, yyyy").toUpperCase();

  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.outerContainer}>
          <div className={styles.bodyContainer}>
            {/* header */}
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>{training.name}</h1>
              <ProfileIcon />
            </div>
            <div className={styles.subHeader}>
              <h2>Number of Questions: {training.quiz.numQuestions}</h2>
              <h2>
                Passing Score: {training.quiz.passingScore}/
                {training.quiz.numQuestions}
              </h2>
            </div>
            {/* instructions */}
            <div className={styles.subHeader}>
              <h2>Instructions</h2>
            </div>
            <p className={styles.instructions}>
              Instruction text goes right here and we can explain what to do
              right here yay
            </p>
            {/* best attempt */}
            <div className={styles.subHeader}>
              <h2>Best Attempt</h2>
            </div>
            {!volunteerTraining.quizScoreRecieved &&
            volunteerTraining.quizScoreRecieved !== 0 ? (
              <div className={styles.noAttemptContainer}>No Recent Attempt</div>
            ) : volunteerTraining.quizScoreRecieved >=
              training.quiz.passingScore ? (
              <div className={styles.passedAttemptContainer}>
                <div className={styles.leftContent}>
                  <span className={styles.dateText}>{formattedDate}</span>
                  <span>
                    {volunteerTraining.quizScoreRecieved}/
                    {training.quiz.numQuestions}
                  </span>
                </div>
                <div className={styles.rightContent}>
                  Passed <FaCheck className={styles.icon} />
                </div>
              </div>
            ) : (
              <div className={styles.failedAttemptContainer}>
                <div className={styles.leftContent}>
                  <span className={styles.dateText}>{formattedDate}</span>
                  <span>
                    {volunteerTraining.quizScoreRecieved}/
                    {training.quiz.numQuestions}
                  </span>
                </div>
                <div className={styles.rightContent}>
                  Did Not Pass
                  <FaXmark className={styles.icon} />
                </div>
              </div>
            )}
          </div>
          {/* footer */}
          <div className={styles.footer}>
            {/* buttons */}
            <div className={styles.footerButtons}>
              <Button sx={{ ...whiteButtonGrayBorder }} variant="contained">
                BACK
              </Button>
              <Button sx={{ ...forestGreenButton }} variant="contained">
                START QUIZ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizLandingPage;

import { useState } from "react";
import { Button } from "@mui/material";
import { forestGreenButton, whiteButtonGrayBorder } from "../../muiTheme";
import { DateTime } from "luxon";
import { FaCheck, FaXmark } from "react-icons/fa6";
import styles from "./QuizLandingPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

const styledButtons = {
  margin: "0 10px 0 10px",
};

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
    quizScoreRecieved: 4,
  };

  // const [volunteerTraining, setVolunteerTraining] = useState<VolunteerTraining>(
  //   {
  //     trainingID: "GQf4rBgvJ4uU9Is89wXp",
  //     progress: "COMPLETED",
  //     dateCompleted: "",
  //     numCompletedResources: 4,
  //     numTotalResources: 4,
  //     quizScoreRecieved: 0,
  //   }
  // );

  // const [training, setTraining] = useState<Training>({
  //   name: "How to pet a cat",
  //   shortBlurb: "",
  //   description: "blah blah blah",
  //   coverImage: "",
  //   resources: [
  //     { type: "VIDEO", link: "https://example.com/video1", title: "Video 1" },
  //     { type: "PDF", link: "https://example.com/article1", title: "Article 1" },
  //     { type: "PDF", link: "https://example.com/article1", title: "Article 2" },
  //     { type: "PDF", link: "https://example.com/article1", title: "Article 3" },
  //   ],
  //   quiz: {
  //     questions: [],
  //     numQuestions: 0,
  //     passingScore: 0,
  //   },
  //   associatedPathways: [],
  //   certificationImage: "",
  // });

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
        <div className={styles.outerContainer}>
          <div className={styles.bodyContainer}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>
                {testDefaultTrainingResource.title}
              </h1>
              <ProfileIcon />
            </div>
            <div className={styles.subHeader}>
              <h2>Number of Questions: {testDefaultQuiz.numQuestions}</h2>
              <h2>Passing Score: {testDefaultQuiz.passingScore}</h2>
            </div>
            <div className={styles.subHeader}>
              <h2>Instructions</h2>
            </div>
            <p className={styles.instructions}>
              Instruction text goes right here and we can explain what to do
              right here yay
            </p>
            <div className={styles.subHeader}>
              <h2>Best Attempt</h2>
            </div>
            {!testDefaultTraining.quizScoreRecieved ? (
              <>
                <div className={styles.noAttemptContainer}>
                  No Recent Attempt
                </div>
              </>
            ) : testDefaultTraining.quizScoreRecieved >=
              testDefaultQuiz.passingScore ? (
              <>
                <div className={styles.passedAttemptContainer}>
                  <div className={styles.leftContent}>
                    <span className={styles.dateText}>{formattedDate}</span>
                    <span>
                      {testDefaultTraining.quizScoreRecieved}/
                      {testDefaultQuiz.numQuestions}
                    </span>
                  </div>
                  <div className={styles.rightContent}>
                    Passed <FaCheck className={styles.icon} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.failedAttemptContainer}>
                  <div className={styles.leftContent}>
                    <span className={styles.dateText}>{formattedDate}</span>
                    <span>
                      {testDefaultTraining.quizScoreRecieved}/
                      {testDefaultQuiz.numQuestions}
                    </span>
                  </div>
                  <div className={styles.rightContent}>
                    Did Not Pass
                    <FaXmark className={styles.icon} />
                  </div>
                </div>
              </>
            )}
          </div>
          {/* footer */}
          <div className={styles.footer}>
            {/* buttons */}
            <div className={styles.buttons}>
              <div>
                <Button
                  sx={{ ...whiteButtonGrayBorder, ...styledButtons }}
                  variant="contained">
                  BACK
                </Button>
                <Button
                  sx={{ ...forestGreenButton, ...styledButtons }}
                  variant="contained">
                  START QUIZ
                </Button>
              </div>
            </div>
          </div>
        </div>
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

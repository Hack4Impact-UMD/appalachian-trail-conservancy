import { LinearProgress, Button } from "@mui/material";
import { forestGreenButton, whiteButtonGrayBorder } from "../../muiTheme";
import { useLocation, Navigate } from "react-router-dom";
import styles from "./QuizResultPage.module.css";
import QuizResultCard from "./QuizResultCard/QuizResultCard";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import atclogo from "../../assets/atc-primary-logo.png";

const styledProgressShape = {
  height: 24,
  borderRadius: 12,
};

// if score > 0, dark green & light gray
const styledProgressPass = {
  ...styledProgressShape,
  backgroundColor: "lightgray",
  "& .MuiLinearProgress-bar": {
    backgroundColor: "var(--forest-green)",
  },
};

// if score = 0, dark gray
const styledProgressFail = {
  ...styledProgressShape,
  backgroundColor: "dimgray",
};

const quizResults = [
  {
    currentQuestion: 1,
    question: "How do you spell Akash's name?",
    answerOptions: ["Akish Patel", "Akesh Pital", "Akash Patil", "Akish Pitil"],
    selectedAnswer: "Akash Patil",
    correctAnswer: "Akish Pitil",
  },
  {
    currentQuestion: 2,
    question: "How many feet do toes normally have?",
    answerOptions: ["20", "Five", "0", "-3"],
    selectedAnswer: "0",
    correctAnswer: "-3",
  },
];

const QuizResultPage = (props: {
  achievedScore: number;
  totalScore: number;
  passingScore: number;
}) => {
  const { achievedScore, totalScore, passingScore } = props;
  const passed = achievedScore >= passingScore;
  const scoredFull = achievedScore == totalScore;

  const location = useLocation();

  if (!location.state?.fromApp) {
    return <Navigate to="/trainings" />;
  }

  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.outerContainer}>
          <div className={styles.bodyContainer}>
            {/* HEADER */}
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Training Title - Quiz</h1>
              <div className={styles.profileIconContainer}>
                <ProfileIcon />
              </div>
            </div>

            <div className={styles.feedback}>
              <div className={styles.certificateImg}>
                <img src={atclogo} alt="certificate image" />
              </div>
              {/* message about score */}
              <div className={styles.feedbackRight}>
                <div>
                  {scoredFull ? (
                    <h3>Perfect score, you passed!</h3>
                  ) : passed ? (
                    <h3>Nice job, you passed!</h3>
                  ) : (
                    <h3>You got this, try again!</h3>
                  )}
                </div>
                {/* score */}
                <div className={styles.score}>
                  <div className={styles.bigNum}>{achievedScore}</div>
                  <div className={styles.smallNum}>/ {totalScore}</div>
                </div>

                {/* progress bar */}
                <LinearProgress
                  variant="determinate"
                  value={achievedScore * 10}
                  sx={
                    achievedScore == 0 ? styledProgressFail : styledProgressPass
                  }
                />
              </div>
            </div>

            <div className={styles.questionContainer}>
              {quizResults.map((result, index) => (
                <QuizResultCard
                  key={index}
                  currentQuestion={result.currentQuestion}
                  question={result.question}
                  answerOptions={result.answerOptions}
                  selectedAnswer={result.selectedAnswer}
                  correctAnswer={result.correctAnswer}
                />
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className={styles.footer}>
          {/* buttons */}
          <div className={styles.footerButtons}>
            {passed ? (
              <Button sx={forestGreenButton} variant="contained">
                Exit training
              </Button>
            ) : (
              <div>
                <Button sx={{ ...whiteButtonGrayBorder }} variant="contained">
                  Exit training
                </Button>
                <Button sx={{ ...whiteButtonGrayBorder }} variant="contained">
                  Restart training
                </Button>
                <Button sx={{ ...forestGreenButton }} variant="contained">
                  Retake quiz
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizResultPage;

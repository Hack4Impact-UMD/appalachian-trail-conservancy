import { Button } from "@mui/material";
import { forestGreenButton, whiteButtonGrayBorder } from "../../muiTheme";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import styles from "./QuizPage.module.css";
import { Question } from "../../types/TrainingType";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Quiz from "./QuizComponent/QuizComponent.tsx";

const styledButtons = {
  marginRight: "10%",
};

const testQuestions = [
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
];

function QuizPage() {
  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.bodyContainer}>
          {/* HEADER */}
          <div className={styles.header}>
            <h1 className={styles.nameHeading}>Training Title - Quiz</h1>
            <ProfileIcon />
          </div>
          <Quiz totalQuestions={2} questions={testQuestions} />
        </div>

        {/* footer */}
        <div className={styles.footer}>
          <Button
            sx={{ ...forestGreenButton, ...styledButtons }}
            variant="contained"
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
}

export default QuizPage;

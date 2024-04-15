import { Button } from "@mui/material";
import { forestGreenButton, whiteButtonGrayBorder } from "../../muiTheme";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import styles from "./QuizPage.module.css";
import { Question } from "../../types/TrainingType";
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
    <div className={styles.bodyContainer}>
      {/* header - title & profile icon */}
      <div className={styles.header}>
        <h1 className={styles.nameHeading}>Training Title - Quiz</h1>
        <ProfileIcon />
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
      <Quiz totalQuestions={2} questions={testQuestions} />
    </div>
  );
}

export default QuizPage;

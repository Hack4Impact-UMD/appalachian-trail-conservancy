import { Button } from "@mui/material";
import { forestGreenButton } from "../../muiTheme";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import styles from "./QuizPage.module.css";
import { Question } from "../../types/TrainingType";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import QuizCard from "./QuizCard/QuizCard";

const styledButtons = {
  marginRight: "10%",
};

const testQuestions: Question[] = [
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
        <div className={styles.outerContainer}>
          <div className={styles.bodyContainer}>
            {/* HEADER */}
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Training Title - Quiz</h1>
              <ProfileIcon />
            </div>
            <div className={styles.questionContainer}>
              {testQuestions.map((option, index) => (
                <QuizCard
                  key={index}
                  currentQuestion={index + 1}
                  question={option.question}
                  answerOptions={option.choices}
                />
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className={styles.footer}>
          <Button
            sx={{ ...forestGreenButton, ...styledButtons }}
            variant="contained">
            Submit
          </Button>
        </div>
      </div>
    </>
  );
}

export default QuizPage;

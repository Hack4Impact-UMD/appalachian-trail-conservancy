import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { forestGreenButton } from "../../muiTheme";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import styles from "./QuizPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import QuizCard from "./QuizCard/QuizCard";
import { Training } from "../../types/TrainingType";

function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state?.fromApp) {
    return <Navigate to="/trainings" />;
  }

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

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

  useEffect(() => {
    if (!location.state || !location.state.training) {
      navigate("/trainings");
    } else {
      // Update state with data from location's state
      if (location.state.training) {
        setTraining(location.state.training);
        setSelectedAnswers(
          Array(location.state.training.quiz.questions.length)
        );
      }
    }
  }, []);

  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.outerContainer}>
          <div className={styles.bodyContainer}>
            {/* HEADER */}
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>{training.name} - Quiz</h1>
              <ProfileIcon />
            </div>
            <div className={styles.questionContainer}>
              {training.quiz.questions.map((option, index) => (
                <QuizCard
                  key={index}
                  currentQuestion={index + 1}
                  question={option.question}
                  answerOptions={option.choices}
                  selectedAnswers={selectedAnswers}
                  setSelectedAnswers={setSelectedAnswers}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className={styles.footer}>
          <div className={styles.footerButtons}>
            <Button
              sx={{ ...forestGreenButton }}
              variant="contained"
              onClick={() => {
                const numAnswersCorrect = training.quiz.questions.reduce(
                  (acc, question, idx) => {
                    return selectedAnswers[idx] === question.answer
                      ? acc + 1
                      : acc;
                  },
                  0
                );
                navigate(`/trainings/quizresult`, {
                  state: {
                    training: training,
                    selectedAnswers: selectedAnswers,
                    achievedScore: numAnswersCorrect,
                    fromApp: true,
                  },
                });
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizPage;

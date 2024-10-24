import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { forestGreenButton } from "../../muiTheme";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { validateQuiz } from "../../backend/FirestoreCalls";
import { Training } from "../../types/TrainingType";
import { VolunteerTraining } from "../../types/UserType";
import styles from "./QuizPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import QuizCard from "./QuizCard/QuizCard";
import Loading from "../../components/LoadingScreen/Loading";

function QuizPage() {
  const auth = useAuth();
  const volunteerId = auth.id.toString();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [volunteerTraining, setVolunteerTraining] = useState<VolunteerTraining>(
    {
      trainingID: "",
      progress: "INPROGRESS",
      dateCompleted: "0000-00-00",
      numCompletedResources: 0,
      numTotalResources: 0,
    }
  );

  // This training should represent the current training corresponding to the current quiz
  // This data should be recieved from navigation state
  const [training, setTraining] = useState<Training>({
    name: "",
    shortBlurb: "",
    description: "",
    coverImage: "",
    resources: [],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    associatedPathways: [],
    certificationImage: "",
    status: "DRAFT",
  });

  useEffect(() => {
    if (
      !location.state ||
      !location.state.training ||
      !location.state.volunteerTraining
    ) {
      navigate("/trainings");
    } else {
      // Update state with data from location's state
      if (location.state.training) {
        setTraining(location.state.training);
        setVolunteerTraining(location.state.volunteerTraining);
        setSelectedAnswers(
          Array(location.state.training.quiz.questions.length)
        );
        setLoading(false);
      }
    }
  }, []);

  const handleSubmitQuiz = () => {
    setQuizLoading(true);
    validateQuiz(volunteerTraining.trainingID, volunteerId, selectedAnswers)
      .then((validateResults) => {
        const numAnswersCorrect = validateResults.data;
        navigate(`/trainings/quizresult`, {
          state: {
            training: training,
            volunteerTraining: volunteerTraining,
            selectedAnswers: selectedAnswers,
            achievedScore: numAnswersCorrect,
            fromApp: true,
          },
        });
      })
      .catch((error) => {
        console.error("Error validating quiz:", error);
      });
  };

  if (!location.state?.fromApp) {
    return <Navigate to="/trainings" />;
  }

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}>
        <div className={styles.outerContainer}>
          <div className={styles.bodyContainer}>
            {/* HEADER */}
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className={styles.header}>
                  <h1 className={styles.nameHeading}>{training.name} - Quiz</h1>
                  <ProfileIcon />
                </div>

                {quizLoading ? (
                  <Loading />
                ) : (
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
                )}
              </>
            )}
          </div>
        </div>

        {/* footer */}
        <div
          className={styles.footer}
          style={{ width: navigationBarOpen ? "calc(100% - 250px)" : "100%" }}>
          <div className={styles.footerButtons}>
            <Button
              sx={{ ...forestGreenButton }}
              variant="contained"
              onClick={handleSubmitQuiz}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizPage;

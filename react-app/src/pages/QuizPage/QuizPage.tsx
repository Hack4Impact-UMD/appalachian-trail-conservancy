import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { forestGreenButton } from "../../muiTheme";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { validateTrainingQuiz } from "../../backend/FirestoreCalls";
import { Training } from "../../types/TrainingType";
import { VolunteerTraining } from "../../types/UserType";
import styles from "./QuizPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import QuizCard from "../../components/QuizCard/QuizCard";
import Loading from "../../components/LoadingScreen/Loading";
import hamburger from "../../assets/hamburger.svg";

function QuizPage() {
  const auth = useAuth();
  const volunteerId = auth.id.toString();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [selectedAnswers, setSelectedAnswers] = useState<
    (string | undefined)[] // undefined allows to check for "empty" positions in sparse array
  >([]);
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
    status: "PUBLISHED",
    associatedPathways: [],
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
          Array(location.state.training.quiz.questions.length).fill(undefined) // fill with undefined to allow for pre-submit warning
        );
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // prompt user before closing/refreshing page
    const preventUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", preventUnload);

    return () => {
      window.removeEventListener("beforeunload", preventUnload);
    };
  }, []);

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmitQuiz = () => {
    setQuizLoading(true);

    // check if any questions are unanswered
    if (selectedAnswers.some((answer) => answer === undefined)) {
      setQuizLoading(false);
      const prompt = window.confirm("Not all questions are answered. Submit?");
      if (!prompt) {
        return; // don't proceed if user hits cancel
      }
      setQuizLoading(true);
    }

    // replace any undefined values with empty string for quiz validation function
    const cleanedSelectedAnswers = selectedAnswers.map((value) =>
      value === undefined ? "" : value
    );

    validateTrainingQuiz(
      volunteerTraining.trainingID,
      volunteerId,
      cleanedSelectedAnswers,
      new Date(Date.now()).toISOString()
    )
      .then((validateResults) => {
        const [numAnswersCorrect, volunteerTrainingInfo] = validateResults.data;
        setVolunteerTraining(volunteerTrainingInfo);
        navigate(`/trainings/quizresult`, {
          state: {
            training: training,
            volunteerTraining: volunteerTrainingInfo,
            selectedAnswers: selectedAnswers,
            achievedScore: numAnswersCorrect,
            fromApp: true,
          },
        });
        setQuizLoading(false);
      })
      .catch((error) => {
        console.error("Error validating quiz:", error);
        setQuizLoading(false);
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
        style={{
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}>
        {!navigationBarOpen && (
          <img
            src={hamburger}
            alt="Hamburger Menu"
            className={styles.hamburger} // Add styles to position it
            width={30}
            onClick={() => setNavigationBarOpen(true)} // Set sidebar open when clicked
          />
        )}

        <div className={styles.outerContainer}>
          <div className={styles.content}>
            {/* HEADER */}
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className={styles.header}>
                  <h1 className={styles.nameHeading}>{training.name} - Quiz</h1>
                  <div className={styles.profileIcon}>
                    <ProfileIcon />
                  </div>
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
          style={{
            width:
              navigationBarOpen && screenWidth > 1200
                ? "calc(100% - 250px)"
                : "100%",
          }}>
          <div className={styles.footerButtons}>
            <Button
              sx={{ ...forestGreenButton }}
              variant="contained"
              onClick={handleSubmitQuiz}
              disabled={quizLoading}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizPage;

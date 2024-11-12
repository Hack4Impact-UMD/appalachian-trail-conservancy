import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { forestGreenButton } from "../../muiTheme";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { validateQuiz } from "../../backend/FirestoreCalls";
import { Pathway } from "../../types/PathwayType";
import { VolunteerPathway } from "../../types/UserType";
import styles from "./PathwayQuizPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import QuizCard from "../QuizPage/QuizCard/QuizCard";
import Loading from "../../components/LoadingScreen/Loading";

function PathwayQuizPage() {
  const auth = useAuth();
  const volunteerId = auth.id.toString();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [volunteerPathway, setVolunteerPathway] = useState<VolunteerPathway>({
    pathwayID: "",
    progress: "INPROGRESS",
    dateCompleted: "0000-00-00",
    trainingsCompleted: [],
    numTrainingsCompleted: 0,
    numTotalTrainings: 0,
  });

  // This training should represent the current training corresponding to the current quiz
  // This data should be recieved from navigation state
  const [pathway, setPathway] = useState<Pathway>({
    name: "",
    shortBlurb: "",
    description: "",
    coverImage: "",
    trainingIDs: [],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    badgeImage: "",
  });

  useEffect(() => {
    if (
      !location.state ||
      !location.state.pathway ||
      !location.state.volunteerPathway
    ) {
      navigate("/pathways");
    } else {
      // Update state with data from location's state
      if (location.state.pathway) {
        setPathway(location.state.pathway);
        setVolunteerPathway(location.state.volunteerPathway);
        setSelectedAnswers(Array(location.state.pathway.quiz.questions.length));
        setLoading(false);
      }
    }
  }, []);

  const handleSubmitQuiz = () => {
    setQuizLoading(true);
  };

  if (!location.state?.fromApp) {
    return <Navigate to="/pathways" />;
  }

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
        <div className={styles.outerContainer}>
          <div className={styles.bodyContainer}>
            {/* HEADER */}
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className={styles.header}>
                  <h1 className={styles.nameHeading}>{pathway.name} - Quiz</h1>
                  <ProfileIcon />
                </div>

                {quizLoading ? (
                  <Loading />
                ) : (
                  <div className={styles.questionContainer}>
                    {pathway.quiz.questions.map((option, index) => (
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
          style={{ width: navigationBarOpen ? "calc(100% - 250px)" : "100%" }}
        >
          <div className={styles.footerButtons}>
            <Button
              sx={{ ...forestGreenButton }}
              variant="contained"
              onClick={() => {}}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PathwayQuizPage;

import { useState, useEffect } from "react";
import { LinearProgress, Button } from "@mui/material";
import { forestGreenButton, whiteButtonGrayBorder } from "../../muiTheme";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./QuizResultPage.module.css";
import QuizResultCard from "./QuizResultCard/QuizResultCard";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import atclogo from "../../assets/atc-primary-logo.png";
import { Training } from "../../types/TrainingType";
import { VolunteerTraining } from "../../types/UserType";

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

const QuizResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
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
  const [volunteerTraining, setVolunteerTraining] = useState<VolunteerTraining>(
    {
      trainingID: "",
      progress: "INPROGRESS",
      dateCompleted: "0000-00-00",
      numCompletedResources: 0,
      numTotalResources: 0,
    }
  );
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [achievedScore, setAchievedScore] = useState<number>(0);

  useEffect(() => {
    // Get data from navigation state
    if (location.state?.fromApp && location.state.training) {
      setTraining(location.state.training);
      setVolunteerTraining(location.state.volunteerTraining);
      setSelectedAnswers(location.state.selectedAnswers);
      setAchievedScore(location.state.achievedScore);
    } else {
      navigate("/trainings");
    }
  }, []);

  const passed = achievedScore >= (training?.quiz.passingScore ?? 0);
  const scoredFull = achievedScore == training?.quiz.numQuestions;
  console.log(achievedScore);
  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}>
        <div className={styles.outerContainer}>
          <div className={styles.bodyContainer}>
            {/* HEADER */}
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>{training.name} - Quiz</h1>
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
                  <div className={styles.smallNum}>
                    / {training?.quiz.numQuestions}
                  </div>
                </div>

                {/* progress bar */}
                <LinearProgress
                  variant="determinate"
                  value={
                    (achievedScore / (training?.quiz.numQuestions ?? 1)) * 100
                  }
                  sx={
                    achievedScore == 0 ? styledProgressFail : styledProgressPass
                  }
                />
              </div>
            </div>

            <div className={styles.questionContainer}>
              {training?.quiz?.questions.map((question, index) => (
                <QuizResultCard
                  key={index}
                  currentQuestion={index}
                  question={question.question}
                  answerOptions={question.choices}
                  selectedAnswer={selectedAnswers[index]}
                  correctAnswer={question.answer}
                />
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div
          className={styles.footer}
          style={{ width: navigationBarOpen ? "calc(100% - 250px)" : "100%" }}>
          {/* buttons */}
          <div className={styles.footerButtons}>
            {passed ? (
              <Button
                sx={forestGreenButton}
                variant="contained"
                onClick={() => navigate("/trainings")}>
                Exit training
              </Button>
            ) : (
              <>
                <Button
                  sx={{ ...whiteButtonGrayBorder }}
                  variant="contained"
                  onClick={() => navigate("/trainings")}>
                  Exit training
                </Button>
                <Button
                  sx={{ ...whiteButtonGrayBorder }}
                  variant="contained"
                  onClick={() =>
                    navigate(`/trainings/:${volunteerTraining.trainingID}`, {
                      state: {
                        volunteerTraining: volunteerTraining,
                        training: training,
                        fromApp: true,
                      },
                    })
                  }>
                  Restart training
                </Button>
                <Button
                  sx={{ ...forestGreenButton }}
                  variant="contained"
                  onClick={() =>
                    navigate(`/trainings/quiz`, {
                      state: {
                        volunteerTraining: volunteerTraining,
                        training: training,
                        fromApp: true,
                      },
                    })
                  }>
                  Retake quiz
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizResultPage;

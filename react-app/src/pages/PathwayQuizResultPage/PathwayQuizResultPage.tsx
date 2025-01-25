import { useState, useEffect } from "react";
import { LinearProgress, Button } from "@mui/material";
import { forestGreenButton, whiteButtonGrayBorder } from "../../muiTheme";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PathwayQuizResultPage.module.css";
import QuizResultCard from "../../components/QuizResultCard/QuizResultCard";
import Badge from "../../components/BadgeCard/BadgeCard";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import { Pathway } from "../../types/PathwayType";
import { VolunteerPathway } from "../../types/UserType";
import hamburger from "../../assets/hamburger.svg";

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

const PathwayQuizResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
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
    status: "PUBLISHED",
  });
  const [volunteerPathway, setVolunteerPathway] = useState<VolunteerPathway>({
    pathwayID: "",
    progress: "INPROGRESS",
    dateCompleted: "0000-00-00",
    trainingsCompleted: [],
    trainingsInProgress: [],
    numTrainingsCompleted: 0,
    numTotalTrainings: 0,
  });
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [achievedScore, setAchievedScore] = useState<number>(0);

  useEffect(() => {
    // Get data from navigation state
    if (location.state?.fromApp && location.state.pathway) {
      setPathway(location.state.pathway);
      setVolunteerPathway(location.state.volunteerPathway);
      setSelectedAnswers(location.state.selectedAnswers);
      setAchievedScore(location.state.achievedScore);
    } else {
      navigate("/pathways");
    }
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

  const passed = achievedScore >= (pathway?.quiz.passingScore ?? 0);
  const scoredFull = achievedScore == pathway?.quiz.numQuestions;

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
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>{pathway.name} - Quiz</h1>
              <div className={styles.profileIconContainer}>
                <ProfileIcon />
              </div>
            </div>

            <div className={styles.feedback}>
              {passed ? (
                <div className={styles.badgeImg}>
                  <Badge
                    title={pathway.name}
                    image={pathway.coverImage}
                    date={volunteerPathway.dateCompleted}
                  />
                </div>
              ) : (
                <></>
              )}
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
                    / {pathway?.quiz.numQuestions}
                  </div>
                </div>

                {/* progress bar */}
                <LinearProgress
                  variant="determinate"
                  value={
                    (achievedScore / (pathway?.quiz.numQuestions ?? 1)) * 100
                  }
                  sx={
                    achievedScore == 0 ? styledProgressFail : styledProgressPass
                  }
                />
              </div>
            </div>

            <div className={styles.questionContainer}>
              {pathway?.quiz?.questions.map((question, index) => (
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
          style={{
            width:
              navigationBarOpen && screenWidth > 1200
                ? "calc(100% - 250px)"
                : "100%",
          }}>
          {/* buttons */}
          <div className={styles.footerButtons}>
            {passed ? (
              <Button
                sx={forestGreenButton}
                variant="contained"
                onClick={() => navigate("/pathways")}>
                Exit pathway
              </Button>
            ) : (
              <>
                <Button
                  sx={{ ...whiteButtonGrayBorder }}
                  variant="contained"
                  onClick={() => navigate("/pathways")}>
                  Exit pathway
                </Button>
                <Button
                  sx={{ ...whiteButtonGrayBorder }}
                  variant="contained"
                  onClick={() =>
                    navigate(`/pathways/:${volunteerPathway.pathwayID}`, {
                      state: {
                        volunteerPathway: volunteerPathway,
                        pathway: pathway,
                        fromApp: true,
                      },
                    })
                  }>
                  Back to Pathway
                </Button>
                <Button
                  sx={{ ...forestGreenButton }}
                  variant="contained"
                  onClick={() =>
                    navigate(`/pathways/quizlanding`, {
                      state: {
                        volunteerPathway: volunteerPathway,
                        pathway: pathway,
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

export default PathwayQuizResultPage;

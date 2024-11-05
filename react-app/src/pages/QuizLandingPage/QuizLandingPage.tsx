import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { forestGreenButton, whiteButtonGrayBorder } from "../../muiTheme";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { Training } from "../../types/TrainingType";
import { type VolunteerTraining } from "../../types/UserType";
import styles from "./QuizLandingPage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import hamburger from "../../assets/hamburger.svg";

function QuizLandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
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
      location.state?.fromApp &&
      location.state.training &&
      location.state.volunteerTraining
    ) {
      setTraining(location.state.training);
      setVolunteerTraining(location.state.volunteerTraining);
      setLoading(false);
    } else {
      navigate("/trainings");
    }
  }, []);

  const location = useLocation();

  if (!location.state?.fromApp) {
    return <Navigate to="/trainings" />;
  }

  const parsedDate = DateTime.fromISO(volunteerTraining.dateCompleted);
  const formattedDate = parsedDate.toFormat("MMMM dd, yyyy").toUpperCase();

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />

      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}>
        {loading ? (
          <Loading />
        ) : (
          <>
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
                {/* header */}
                <div className={styles.header}>
                  <h1 className={styles.nameHeading}>{training.name}</h1>
                  <ProfileIcon />
                </div>
                <div className={`${styles.subHeader} ${styles.questionInfo}`}>
                  <h2>Number of Questions: {training.quiz.numQuestions}</h2>
                  <h2>
                    Passing Score: {training.quiz.passingScore}/
                    {training.quiz.numQuestions}
                  </h2>
                </div>
                {/* instructions */}
                <div className={styles.subHeader}>
                  <h2>Instructions</h2>
                </div>
                <p className={styles.instructions}>
                  Instruction text goes right here and we can explain what to do
                  right here yay
                </p>
                {/* best attempt */}
                <div className={styles.subHeader}>
                  <h2>Best Attempt</h2>
                </div>
                {!volunteerTraining.quizScoreRecieved &&
                volunteerTraining.quizScoreRecieved !== 0 ? (
                  <div className={styles.noAttemptContainer}>
                    No Recent Attempt
                  </div>
                ) : volunteerTraining.quizScoreRecieved >=
                  training.quiz.passingScore ? (
                  <div className={styles.passedAttemptContainer}>
                    <div className={styles.leftContent}>
                      <span className={styles.dateText}>{formattedDate}</span>
                      <span>
                        {volunteerTraining.quizScoreRecieved}/
                        {training.quiz.numQuestions}
                      </span>
                    </div>
                    <div className={styles.rightContent}>
                      Passed <FaCheck className={styles.icon} />
                    </div>
                  </div>
                ) : (
                  <div className={styles.failedAttemptContainer}>
                    <div className={styles.leftContent}>
                      <span className={styles.dateText}>{formattedDate}</span>
                      <span>
                        {volunteerTraining.quizScoreRecieved}/
                        {training.quiz.numQuestions}
                      </span>
                    </div>
                    <div className={styles.rightContent}>
                      Did Not Pass
                      <FaXmark className={styles.icon} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {/* footer */}
        <div
          className={styles.footer}
          style={{
            width: navigationBarOpen ? "calc(100% - 250px)" : "100%",
          }}>
          {/* buttons */}
          <div className={styles.footerButtons}>
            <Button
              sx={{ ...whiteButtonGrayBorder }}
              variant="contained"
              onClick={() =>
                navigate("/trainings/resources", {
                  state: {
                    training: training,
                    volunteerTraining: volunteerTraining,
                    fromApp: true,
                  },
                })
              }>
              BACK
            </Button>
            <Button
              sx={{ ...forestGreenButton }}
              variant="contained"
              onClick={() =>
                navigate(`/trainings/quiz`, {
                  state: {
                    training: training,
                    volunteerTraining: volunteerTraining,
                    fromApp: true,
                  },
                })
              }>
              START QUIZ
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizLandingPage;

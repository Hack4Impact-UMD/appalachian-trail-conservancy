import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PathwayID } from "../../types/PathwayType";
import { type VolunteerPathway } from "../../types/UserType";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import styles from "./PathwayQuizLandingPage.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import { DateTime } from "luxon";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { Button } from "@mui/material";
import { forestGreenButton, whiteButtonGrayBorder } from "../../muiTheme";

function PathwayQuizLandingPage() {
  const navigate = useNavigate();
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [volunteerPathway, setVolunteerPathway] = useState<VolunteerPathway>({
    pathwayID: "",
    progress: "INPROGRESS",
    dateCompleted: "0000-00-00",
    trainingsCompleted: [],
    numTrainingsCompleted: 0,
    numTotalTrainings: 0,
  });

  const [pathway, setPathway] = useState<PathwayID>({
    name: "",
    id: "",
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

  useEffect(() => {
    if (
      location.state?.fromApp &&
      location.state.pathway &&
      location.state.volunteerPathway
    ) {
      setPathway(location.state.pathway);
      setVolunteerPathway(location.state.volunteerPathway);
    } else {
      navigate("/pathways");
    }
  }, []);

  const location = useLocation();

  if (!location.state?.fromApp) {
    return <Navigate to="/pathways" />;
  }

  const parsedDate = DateTime.fromISO(volunteerPathway.dateCompleted);
  const formattedDate = parsedDate.toFormat("MMMM dd, yyyy").toUpperCase();

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}>
        <div className={styles.outerContainer}>
          <div className={styles.bodyContainer}>
            {/* header */}
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>{pathway.name}</h1>
              <ProfileIcon />
            </div>
            <div className={styles.subHeader}>
              <h2>Number of Questions: {pathway.quiz.numQuestions}</h2>
              <h2>
                Passing Score: {pathway.quiz.passingScore}/
                {pathway.quiz.numQuestions}
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
            {!volunteerPathway.quizScoreRecieved &&
            volunteerPathway.quizScoreRecieved !== 0 ? (
              <div className={styles.noAttemptContainer}>No Recent Attempt</div>
            ) : volunteerPathway.quizScoreRecieved >=
              pathway.quiz.passingScore ? (
              <div className={styles.passedAttemptContainer}>
                <div className={styles.leftContent}>
                  <span className={styles.dateText}>{formattedDate}</span>
                  <span>
                    {volunteerPathway.quizScoreRecieved}/
                    {pathway.quiz.numQuestions}
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
                    {volunteerPathway.quizScoreRecieved}/
                    {pathway.quiz.numQuestions}
                  </span>
                </div>
                <div className={styles.rightContent}>
                  Did Not Pass
                  <FaXmark className={styles.icon} />
                </div>
              </div>
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
                    navigate(`/pathways/${pathway.id}`, {
                      state: {
                        pathway: pathway,
                        volunteerPathway: volunteerPathway,
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
                    navigate(`/pathways/quiz`, {
                      state: {
                        pathway: pathway,
                        volunteerPathway: volunteerPathway,
                        fromApp: true,
                      },
                    })
                  }>
                  START QUIZ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PathwayQuizLandingPage;

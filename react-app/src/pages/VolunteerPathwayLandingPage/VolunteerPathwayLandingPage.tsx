import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import VolunteerNavigationBar from "../../components/VolunteerNavigationBar/VolunteerNavigationBar.tsx";
import PathwayTile from "./PathwayTile/PathwayTile.tsx";
import TitleInfo from "./TileInfo/TitleInfo.tsx";
import styles from "./VolunteerPathwayLandingPage.module.css";
import hamburger from "../../assets/hamburger.svg";
import Footer from "../../components/Footer/Footer.tsx";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import { useParams, useLocation } from "react-router-dom";
import { TrainingID } from "../../types/TrainingType.ts";
import { PathwayID } from "../../types/PathwayType.ts";
import { VolunteerPathway } from "../../types/UserType.ts";
import { useAuth } from "../../auth/AuthProvider.tsx";
import { Alert, Snackbar } from "@mui/material";
import {
  getPathway,
  getTraining,
  getVolunteer,
} from "../../backend/FirestoreCalls.ts";
import { addVolunteerPathway } from "../../backend/VolunteerFirestoreCalls.ts";

function VolunteerPathwayLandingPage() {
  const auth = useAuth();
  const pathwayId = useParams().id;
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(!(window.innerWidth < 1200));
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [divWidth, setDivWidth] = useState<number>(0);
  const [trainings, setTrainings] = useState<TrainingID[]>([]);
  const [numCompleted, setNumCompleted] = useState<number>(0);
  const [elements, setElements] = useState<any[]>([]);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

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
    status: "DRAFT",
  });

  const [volunteerPathway, setVolunteerPathway] = useState<VolunteerPathway>({
    pathwayID: "",
    progress: "INPROGRESS",
    dateCompleted: "",
    trainingsCompleted: [],
    trainingsInProgress: [],
    numTrainingsCompleted: 0,
    numTotalTrainings: pathway.trainingIDs.length,
  });
  const div = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const getPathwayInfo = async () => {
      // get pathway if not coming from in app
      if (pathwayId !== undefined && !location.state?.pathway) {
        if (pathwayId !== undefined && !auth.loading && auth.id) {
          getPathway(pathwayId)
            .then(async (pathwayData) => {
              // if pathway is not published, redirect to home
              if (pathwayData.status !== "PUBLISHED") {
                navigate("/");
              }

              setPathway(pathwayData);
              const trainingPromises = pathwayData.trainingIDs.map(getTraining);
              const fetchedTrainings = await Promise.all(trainingPromises);
              setTrainings(fetchedTrainings);
            })
            .catch(() => {
              console.log("Failed to get pathway");
              setLoading(false);
            });
        }
      } else {
        // set pathway from location state
        if (location.state.pathway) {
          setPathway(location.state.pathway);
          const trainingPromises =
            location.state.pathway.trainingIDs.map(getTraining);
          const fetchedTrainings = await Promise.all(trainingPromises);
          setTrainings(fetchedTrainings);
        }
      }
    };
    getPathwayInfo();
  }, [auth.loading, auth.id, location.state, pathwayId]);

  useEffect(() => {
    // Filters based on the current pathway to get the number of trainings the user completed
    const getTrainingsCompleted = async () => {
      if (!auth.loading && auth.id && pathwayId !== undefined) {
        try {
          const volunteer = await getVolunteer(auth.id.toString());
          const pathwayList = volunteer.pathwayInformation;
          const volunteerPathway = pathwayList.filter(
            (thePathway) => pathwayId === thePathway.pathwayID
          );

          if (volunteerPathway.length > 0) {
            // pathway is in progress or completed
            const numTrainings = volunteerPathway[0].numTrainingsCompleted;
            setVolunteerPathway(volunteerPathway[0]);
            setNumCompleted(numTrainings);
            if (volunteerPathway[0].progress === "COMPLETED") {
              setQuizPassed(true);
            }
          } else {
            // pathway is not in the volunteer's pathway list (i.e. not started)
            const trainingList = volunteer.trainingInformation;

            if (trainings.length !== 0) {
              // check if volunteer started first training in pathway
              const firstTrainingID = trainings[0].id;
              const firstVolunteerTraining = trainingList.find(
                (training) => training.trainingID === firstTrainingID
              );

              // if first training is in progress or completed, mark the pathway as in progress
              if (firstVolunteerTraining) {
                const newVolunteerPathway: VolunteerPathway = {
                  pathwayID: pathway.id,
                  progress: "INPROGRESS", // Assuming initial progress is "INPROGRESS"
                  dateCompleted: "", // Initialize with empty string
                  trainingsCompleted: [], // Initialize with empty array
                  trainingsInProgress: [], // Initialize with empty array
                  numTrainingsCompleted: 0, // Initialize with 0
                  numTotalTrainings: pathway.trainingIDs.length, // Initialize with number of trainings in pathway
                };

                let consecutiveCompletion = false;

                // update volunteer pathway with first training status
                if (firstVolunteerTraining.progress === "COMPLETED") {
                  newVolunteerPathway.trainingsCompleted.push(firstTrainingID);
                  newVolunteerPathway.numTrainingsCompleted++;
                  consecutiveCompletion = true;
                } else {
                  newVolunteerPathway.trainingsInProgress.push(firstTrainingID);
                }

                // check other trainings in pathway if first training is in progress/completed
                for (let i = 1; i < trainings.length; i++) {
                  const trainingID = trainings[i].id;
                  const volunteerTraining = trainingList.find(
                    (training) => training.trainingID === trainingID
                  );

                  if (volunteerTraining) {
                    if (volunteerTraining.progress === "COMPLETED") {
                      newVolunteerPathway.trainingsCompleted.push(trainingID);
                      if (consecutiveCompletion) {
                        newVolunteerPathway.numTrainingsCompleted++;
                      }
                    } else {
                      newVolunteerPathway.trainingsInProgress.push(trainingID);
                      consecutiveCompletion = false;
                    }
                  }
                }

                setNumCompleted(newVolunteerPathway.numTrainingsCompleted);
                addVolunteerPathway(auth.id.toString(), newVolunteerPathway);
                setVolunteerPathway(newVolunteerPathway);
              }
            } else {
              // volunteer has not started pathway
              setNumCompleted(0);
            }
          }
        } catch (error) {
          console.error("Error fetching volunteer data:", error);
          setLoading(false);
        }
        setLoading(false);
      }
    };

    getTrainingsCompleted();
  }, [trainings, auth.loading, auth.id, pathway, pathwayId]);

  useEffect(() => {
    // when the component gets mounted
    if (div.current) setDivWidth(div.current.offsetWidth);
    // to handle page resize
    const getwidth = () => {
      if (div.current) setDivWidth(div.current.offsetWidth);
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", getwidth);
    // remove the event listener before the component gets unmounted
    return () => window.removeEventListener("resize", getwidth);
  }, [open]);

  useEffect(() => {
    if (trainings.length) renderGrid(trainings);
  }, [divWidth, trainings, numCompleted]);

  const renderGrid = (trainings: TrainingID[]) => {
    const imgWidth = 300;
    const imagesPerRow = Math.floor(divWidth / imgWidth);
    // To prevent trainings.length from being used uninitialized
    const height =
      trainings.length == 0
        ? 0
        : Math.ceil((trainings.length + 1) / imagesPerRow);
    let count = 0;
    const newElts = [];

    for (let i = 0; i < height; i++) {
      if (i % 2 == 0) {
        for (let j = count; j < count + imagesPerRow; j++) {
          newElts.push(
            <div key={j}>
              <PathwayTile
                tileNum={j}
                pathwayID={pathway}
                trainingID={j < trainings.length ? trainings[j] : undefined}
                width={divWidth}
                numTrainings={trainings.length}
                trainingsCompleted={numCompleted}
                quizPassed={quizPassed}
                volunteerTrainings={[
                  ...volunteerPathway.trainingsCompleted,
                  ...volunteerPathway.trainingsInProgress,
                ]}
                volunteerPathway={volunteerPathway}
                setSnackbar={setSnackbar}
                setSnackbarMessage={setSnackbarMessage}
                setPopupOpen={setPopupOpen}
              />
            </div>
          );
        }
      }
      // Reverse
      else {
        for (let j = count + imagesPerRow - 1; j >= count; j--) {
          newElts.push(
            <div key={j}>
              <PathwayTile
                tileNum={j}
                pathwayID={pathway}
                trainingID={j < trainings.length ? trainings[j] : undefined}
                width={divWidth}
                numTrainings={trainings.length}
                trainingsCompleted={numCompleted}
                quizPassed={quizPassed}
                volunteerTrainings={[
                  ...volunteerPathway.trainingsCompleted,
                  ...volunteerPathway.trainingsInProgress,
                ]}
                volunteerPathway={volunteerPathway}
                setSnackbar={setSnackbar}
                setSnackbarMessage={setSnackbarMessage}
                setPopupOpen={setPopupOpen}
              />
            </div>
          );
        }
      }
      count += imagesPerRow;
    }
    setElements(newElts);
  };

  return (
    <>
      <div className={popupOpen ? styles.popupOpen : ""}>
        <VolunteerNavigationBar open={open} setOpen={setOpen} />
      </div>

      <div
        className={`${styles.split} ${styles.right}`}
        style={{
          // Only apply left shift when screen width is greater than 1200px
          left: open && screenWidth > 1200 ? "250px" : "0",
        }}
      >
        {!open && (
          <img
            src={hamburger}
            alt="Hamburger Menu"
            className={styles.hamburger} // Add styles to position it
            width={30}
            onClick={() => setOpen(true)} // Set sidebar open when clicked
          />
        )}
        <div className={styles.pageContainer}>
          <div className={styles.content} ref={div}>
            <TitleInfo
              title={pathway.name}
              description={pathway.description}
              volunteerPathway={volunteerPathway}
            />

            {/* Pathway Tiles Section */}
            {loading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : (
              <div className={styles.pathwayTiles}>{elements}</div>
            )}
          </div>
        </div>
        <Snackbar
          open={snackbar}
          autoHideDuration={6000}
          onClose={() => setSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position within the right section
        >
          <Alert
            onClose={() => setSnackbar(false)}
            severity={
              snackbarMessage.includes("successfully") ? "success" : "error"
            }
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Footer />
      </div>
    </>
  );
}

export default VolunteerPathwayLandingPage;

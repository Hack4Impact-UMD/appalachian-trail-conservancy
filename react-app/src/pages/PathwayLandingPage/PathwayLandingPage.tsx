import { useState, useEffect, useRef } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import PathwayTile from "./PathwayTile/PathwayTile";
import TitleInfo from "./TileInfo/TitleInfo";
import styles from "./PathwayLandingPage.module.css";
import hamburger from "../../assets/hamburger.svg";
import Footer from "../../components/Footer/Footer";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import { useParams, useLocation } from "react-router-dom";
import { TrainingID } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType";
import { useAuth } from "../../auth/AuthProvider";
import {
  getPathway,
  getTraining,
  getVolunteer,
} from "../../backend/FirestoreCalls";
import { VolunteerPathway } from "../../types/UserType.ts";

function PathwayLandingPage() {
  const auth = useAuth();
  const pathwayId = useParams().id;
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(!(window.innerWidth < 1200));
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [divWidth, setDivWidth] = useState<number>(0);
  const [trainings, setTrainings] = useState<TrainingID[]>([]);
  const [volunteerPathway, setVolunteerPathway] = useState<VolunteerPathway>();
  const [numCompleted, setNumCompleted] = useState<number>(0);
  const [elements, setElements] = useState<any[]>([]);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);

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
    status: "DRAFT",
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
          const fetchedTrainings = await Promise.all(trainingPromises); // I think it's breaking here
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
            if (volunteerPathway[0].dateCompleted !== "") {
              setQuizPassed(true);
            }
          } else {
            // pathway is not in the volunteer's pathway list (i.e. not started)
            const trainingList = volunteer.trainingInformation;

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
              console.log("New Volunteer Pathway:", newVolunteerPathway);
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
                trainingID={j < trainings.length ? trainings[j] : undefined}
                width={divWidth}
                numTrainings={trainings.length}
                trainingsCompleted={numCompleted}
                quizPassed={quizPassed}
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
                trainingID={j < trainings.length ? trainings[j] : undefined}
                width={divWidth}
                numTrainings={trainings.length}
                trainingsCompleted={numCompleted}
                quizPassed={quizPassed}
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
      <NavigationBar open={open} setOpen={setOpen} />

      <div
        className={`${styles.split} ${styles.right}`}
        style={{
          // Only apply left shift when screen width is greater than 1200px
          left: open && screenWidth > 1200 ? "250px" : "0",
        }}>
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
            <TitleInfo title={pathway.name} description={pathway.description} />

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
        <Footer />
      </div>
    </>
  );
}

export default PathwayLandingPage;

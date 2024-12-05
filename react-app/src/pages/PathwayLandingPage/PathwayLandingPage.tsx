import { useState, useEffect, useRef } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import PathwayTile from "./PathwayTile/PathwayTile";
import TitleInfo from "./TileInfo/TitleInfo";
import styles from "./PathwayLandingPage.module.css";
import hamburger from "../../assets/hamburger.svg";
import Footer from "../../components/Footer/Footer";
import { useParams, useLocation } from "react-router-dom";
import { TrainingID } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType";
import { useAuth } from "../../auth/AuthProvider";
import {
  getPathway,
  getTraining,
  getVolunteer,
} from "../../backend/FirestoreCalls";

function PathwayLandingPage() {
  const auth = useAuth();
  const pathwayId = useParams().id;
  const location = useLocation();
  const [open, setOpen] = useState(!(window.innerWidth < 1200));
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [divWidth, setDivWidth] = useState<number>(0);
  const [trainings, setTrainings] = useState<TrainingID[]>([]);
  const [numCompleted, setNumCompleted] = useState<number>(0);
  const [elements, setElements] = useState<any[]>([]);

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

    // Filters based on the current pathway to get the number of trainings the user completed
    // Commented out until the other stuff is working
    const getTrainingsCompleted = async () => {
      if (!auth.loading && auth.id && pathwayId !== undefined) {
        try {
          const volunteer = await getVolunteer(auth.id.toString());
          const pathwayList = volunteer.pathwayInformation;
          const volunteerPathway = pathwayList.filter(
            (thePathway) => pathwayId === thePathway.pathwayID
          );

          if (volunteerPathway.length > 0) {
            const numTrainings = volunteerPathway[0].numTrainingsCompleted;
            setNumCompleted(numTrainings);
          } else {
            setNumCompleted(0);
          }
        } catch (error) {
          console.error("Error fetching volunteer data:", error);
        }
      }
    };

    getTrainingsCompleted();
  }, [auth.loading, auth.id]);

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
  }, [divWidth, trainings]);

  const renderGrid = (trainings: TrainingID[]) => {
    const imgWidth = 300;
    const imagesPerRow = Math.floor(divWidth / imgWidth);
    // To prevent trainings.length from being used uninitialized
    const height =
      trainings.length == 0
        ? 0
        : Math.ceil((trainings.length + 1) / imagesPerRow);
    let count = 0;
    let newElts = [];

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
                trainingsCompleted={numCompleted} // Filler for now
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
                trainingsCompleted={numCompleted} // Filler for now
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
            <TitleInfo title={pathway.name} description={pathway.shortBlurb} />

            {/* Pathway Tiles Section */}
            <div className={styles.pathwayTiles}>{elements}</div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default PathwayLandingPage;

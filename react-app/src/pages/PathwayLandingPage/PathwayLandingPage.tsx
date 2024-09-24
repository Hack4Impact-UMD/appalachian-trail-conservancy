import React, { useState, useEffect, useRef } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import TitleInfo from "./TitleInfo";
import styles from "./PathwayLandingPage.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import PathwayTile from "./PathwayTile";
import { VolunteerPathway } from "../../types/UserType";
import { PathwayID } from "../../types/PathwayType";
import { useAuth } from "../../auth/AuthProvider";
import Loading from "../../components/LoadingScreen/Loading";
import { getTraining } from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";

const PathwayLandingPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [divWidth, setDivWidth] = useState<number>(0);
  const [trainings, setTrainings] = useState<TrainingID[]>([]);

  {
    /*
  const [volunteerPathway, setVolunteerPathway] = useState<VolunteerPathway>({
    pathwayID: "",
    progress: "INPROGRESS",
    dateCompleted: "0000-00-00", // YYYY-MM-DD
    trainingsCompleted: [], // training IDs
    numTrainingsCompleted: 0,
    numTotalTrainings: 0,
  }); */
  }

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
  });

  const fetchTrainings = async () => {
    const trainingPromises = pathway.trainingIDs.map(getTraining);
    const fetchedTrainings = await Promise.all(trainingPromises);
    setTrainings(fetchedTrainings);
  };

  const div = useRef<HTMLDivElement>(null);
  const imgSize = 55;

  useEffect(() => {
    // get data from nav state
    // not retrieving volunteer pathway information yet
    if (location.state.pathway) {
      setPathway(location.state.pathway);
      fetchTrainings(); // set trainings to the list of trainingIDs
    } else {
      navigate("/pathways");
    }
    const getWidth = () => {
      if (div.current)
        setDivWidth(div.current.offsetWidth);      
    };
    window.addEventListener("resize", getWidth);
    return () => window.removeEventListener("resize", getWidth);

    
  }, [pathway.trainingIDs]);

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
        <div className={styles.pageContainer}>
          <div className={styles.content}>
            <TitleInfo title={pathway.name} description={pathway.shortBlurb} />

            {/* Pathway Tiles Section */}
            <div className={styles.pathwayTiles} ref={div}>
              {/* console.log(divWidth)*/}

              {/* Render the Pathway tiles */}
              {trainings.map((trainingData, index) => (
                <PathwayTile tileNum={index + 1} trainingID={trainingData} space={divWidth} count={trainings.length}
                />
                
              ))}
              {console.log("Width " + divWidth + "\nlength " + trainings.length)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PathwayLandingPage;

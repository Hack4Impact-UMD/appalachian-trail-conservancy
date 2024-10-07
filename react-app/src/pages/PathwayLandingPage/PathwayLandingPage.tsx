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
import { WidthFull } from "@mui/icons-material";

const PathwayLandingPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [divWidth, setDivWidth] = useState<number>(0);
  const [trainings, setTrainings] = useState<TrainingID[]>([]);

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

  const imgWidth = 300;
  const imagesPerRow = Math.floor(divWidth / imgWidth);
  const height = Math.ceil(trainings.length / imagesPerRow);
  let elements = [];
  let count = 0;

  for (let i = 0; i < height; i++) {
    if (i % 2 == 0) {
      for (let j = count; j < count + imagesPerRow; j++) {
        elements.push(
          <div key={j}>
            <PathwayTile
              tileNum={j}
              trainingID={j < trainings.length ? trainings[j] : undefined}
              space={divWidth}
              count={trainings.length}
            />
          </div>
        );
      }
    }
    // Reverse
    else {
      for (let j = count + imagesPerRow - 1; j >= count; j--) {
        elements.push(
          <div key={j}>
            <PathwayTile
              tileNum={j}
              trainingID={j < trainings.length ? trainings[j] : undefined}
              space={divWidth}
              count={trainings.length}
            />
          </div>
        );
      }
    }
    count += imagesPerRow;
    console.log();
  }

  useEffect(() => {
    // get data from nav state
    // not retrieving volunteer pathway information yet
    // do the bookmark case - get the pathway id from the url in the browser
    if (location.state.pathway) {
      setPathway(location.state.pathway);
      fetchTrainings(); // set trainings to the list of trainingIDs
    } else {
      navigate("/pathways");
    }
  }, [pathway.trainingIDs]);

  //console.log("Width " + divWidth + "\nlength " + trainings.length);
  useEffect(() => {
    // when the component gets mounted
    if (div.current) setDivWidth(div.current.offsetWidth);
    // to handle page resize
    const getwidth = () => {
      if (div.current) setDivWidth(div.current.offsetWidth);
    };
    window.addEventListener("resize", getwidth);
    // remove the event listener before the component gets unmounted
    return () => window.removeEventListener("resize", getwidth);
  }, []);

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
        <div className={styles.pageContainer}>
          <div className={styles.content} ref={div}>
            <TitleInfo title={pathway.name} description={pathway.shortBlurb} />

            {/* Pathway Tiles Section */}
            <div className={styles.pathwayTiles} >
              {/* Render the Pathway tiles */}
              {/* {trainings.map((trainingData, index) => (
                <PathwayTile
                  tileNum={index + 1}
                  trainingID={trainingData}
                  space={divWidth}
                  count={trainings.length}
                />
              ))}{" "} */}
              {/* for loop + 1 */}
              {/* <PathwayTile
                tileNum={1}
                space={divWidth}
                count={trainings.length}
              /> */}
              {elements}
              {/* for loop - even row do 1 2 3, odd row do 6 4 5, etc  */}
              {divWidth}
              {"\t" + trainings.length}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PathwayLandingPage;

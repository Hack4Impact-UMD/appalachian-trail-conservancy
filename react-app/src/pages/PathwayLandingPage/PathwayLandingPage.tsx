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

const PathwayLandingPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [divWidth, setDivWidth] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);

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

  // Can this be done better?
  // Gets the current pathway id from url, url in form: .../pathways/<ID#>
  //const pathwayId = window.location.href.substring(
  //  window.location.href.length - 20,
  //  window.location.href.length
  //);

  const div = useRef<HTMLDivElement>(null);

  const trainingNum = 5;
  const imgSize = 55;
  const width = divWidth;

  useEffect(() => {
    // get data from nav state
    // not retrieving volunteer pathway information yet
    if (location.state.pathway) {
      setPathway(location.state.pathway);
      setLoading(false);
    } else {
      navigate("/pathways");
    }
    if (div.current) {
      setDivWidth(div.current.offsetWidth);
    }
  }, []);

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
        {loading ? (
          <Loading />
        ) : (
          <div className={styles.pageContainer}>
            <div className={styles.content}>
              <TitleInfo
                title={pathway.name}
                description={pathway.shortBlurb}
              />

              {/* Pathway Tiles Section */}
              <div className={styles.pathwayTiles} ref={div}>
                {/* console.log(divWidth)*/}

                {pathway.trainingIDs.map((trainingID, index) => (
                  /*how to pass in training ID???*/
                  <PathwayTile tileNum={index + 1} trainingID={trainingID} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PathwayLandingPage;

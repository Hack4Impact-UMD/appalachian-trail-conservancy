import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PathwayTile.module.css";
import emptyIcon from "../../../assets/PathwayTiles/Empty.svg";
import downEndIcon from "../../../assets/PathwayTiles/DownEnd.svg";
import downLeftIcon from "../../../assets/PathwayTiles/DownLeft.svg";
import downRightIcon from "../../../assets/PathwayTiles/DownRight.svg";
import horizontalIcon from "../../../assets/PathwayTiles/Horizontal.svg";
import leftDownIcon from "../../../assets/PathwayTiles/LeftDown.svg";
import rightEndIcon from "../../../assets/PathwayTiles/RightEnd.svg";
import rightDownIcon from "../../../assets/PathwayTiles/RightDown.svg";
import leftEndIcon from "../../../assets/PathwayTiles/LeftEnd.svg";
import verticalIcon from "../../../assets/PathwayTiles/Vertical.svg";
import PathwayTrainingPopup from "../../../components/PathwayTrainingPopup/PathwayTrainingPopup";

import downLeftCompleted from "../../../assets/PathwayTiles/CompletedTiles/DownLeftCompleted.svg";
import downTrophy from "../../../assets/PathwayTiles/CompletedTiles/DownTrophy.svg";
import leftDownCompleted from "../../../assets/PathwayTiles/CompletedTiles/LeftDownCompleted.svg";
import rightDownCompleted from "../../../assets/PathwayTiles/CompletedTiles/RightDownCompleted.svg";
import verticalCompleted from "../../../assets/PathwayTiles/CompletedTiles/VerticalCompleted.svg";
import downRightCompleted from "../../../assets/PathwayTiles/CompletedTiles/DownRightCompleted.svg";
import rightCompleted from "../../../assets/PathwayTiles/CompletedTiles/RightCompleted.svg";
import leftCompleted from "../../../assets/PathwayTiles/CompletedTiles/LeftCompleted.svg";
import leftTrophy from "../../../assets/PathwayTiles/CompletedTiles/LeftTrophy.svg";
import rightTrophy from "../../../assets/PathwayTiles/CompletedTiles/RightTrophy.svg";

import downLeftInter from "../../../assets/PathwayTiles/IntermediateTiles/DownLeftInter.svg";
import downRightInter from "../../../assets/PathwayTiles/IntermediateTiles/DownRightInter.svg";
import rightInter from "../../../assets/PathwayTiles/IntermediateTiles/RightInter.svg";
import leftInter from "../../../assets/PathwayTiles/IntermediateTiles/LeftInter.svg";
import leftDownInter from "../../../assets/PathwayTiles/IntermediateTiles/LeftDownInter.svg";
import rightDownInter from "../../../assets/PathwayTiles/IntermediateTiles/RightDownInter.svg";
import verticalInter from "../../../assets/PathwayTiles/IntermediateTiles/VerticalInter.svg";
import { TrainingID } from "../../../types/TrainingType";
import { PathwayID } from "../../../types/PathwayType.ts";
import { useAuth } from "../../../auth/AuthProvider.tsx";
import { getVolunteer } from "../../../backend/FirestoreCalls";
import { VolunteerTraining, VolunteerPathway } from "../../../types/UserType";
import { Tooltip } from "@mui/material";
import { grayTooltip } from "../../../muiTheme";

interface PathwayTileProps {
  tileNum: number; // index of the tile
  pathwayID: PathwayID; // pathwayID of the pathway
  trainingID?: TrainingID; // trainingID of the specific training
  width: number; // width of the div
  numTrainings: number; // total number of trainings in this pathway
  trainingsCompleted: number;
  quizPassed: boolean;
  volunteerTrainings: string[];
  volunteerPathway: VolunteerPathway;
  setSnackbar: any;
  setSnackbarMessage: any;
  setPopupOpen: any;
}

// imagesPerRow: the total number of images per row, used to identify which direction
// index: specific index of the training in pathway
// count: total number of trainings in pathway
// trainingsCompleted: the number of trainings in this pathway that have been finished
function getImage(
  imagesPerRow: number,
  index: number,
  numTrainings: number,
  trainingsCompleted: number,
  quizPassed: boolean
) {
  // Empty
  if (index > numTrainings) return emptyIcon;
  // Straight down
  if (imagesPerRow === 1) {
    // Check that the index has been completed
    if (index <= trainingsCompleted && trainingsCompleted != 0) {
      // Check if it is the final one
      if (index === numTrainings) return quizPassed ? downTrophy : downEndIcon;
      // Check if it is the last one in the sequence
      if (index + 1 === trainingsCompleted)
        return quizPassed ? verticalCompleted : verticalInter;

      // Check if it hasn't been completed
      return index === trainingsCompleted ? verticalIcon : verticalCompleted;
    }
    return index === numTrainings ? downEndIcon : verticalIcon;
  }
  // Not reversed
  if (Math.floor(index / imagesPerRow) % 2 === 0) {
    // Right-most icon
    if ((index + 1) % imagesPerRow === 0) {
      // Check if this has been completed or its an intermediate icon
      if (index <= trainingsCompleted && trainingsCompleted != 0) {
        // Check if this is the last one completed
        if (index === numTrainings)
          return quizPassed ? rightTrophy : rightEndIcon;
        // Check if this icon is the most recent completed
        if (index + 1 === trainingsCompleted)
          return quizPassed ? rightDownCompleted : rightDownInter;

        // Check if this should be a normal icon or completed
        return index === trainingsCompleted
          ? rightDownIcon
          : rightDownCompleted;
      }
      return index === numTrainings ? rightEndIcon : rightDownIcon;
      // Left-most icon
    } else if (index % imagesPerRow === 0) {
      // Check if either intermediate icon or completed icon
      if (index <= trainingsCompleted && trainingsCompleted != 0) {
        // Check if this is the final one
        if (index === numTrainings) {
          // Check if it is going down or not
          if (index > 0) return quizPassed ? downTrophy : downEndIcon;
          else return quizPassed ? rightTrophy : rightEndIcon;
        }
        // Check if this icon is the first icon and whether it's an intermediate
        if (index === 0) {
          if (index + 1 === trainingsCompleted)
            return quizPassed ? rightCompleted : rightInter;
          else return rightCompleted;
        }

        // Check if this is an intermediate icon
        if (index + 1 === trainingsCompleted)
          return quizPassed ? downRightCompleted : downRightInter;

        return index === trainingsCompleted
          ? downRightIcon
          : downRightCompleted;
      }

      // Check if very first icon
      if (index === 0) {
        return horizontalIcon;
      } else {
        return index === numTrainings ? downEndIcon : downRightIcon;
      }
    }

    // Check for completeness for middle icons
    if (index <= trainingsCompleted && trainingsCompleted != 0) {
      // Check for trophy
      if (index == numTrainings) return quizPassed ? rightTrophy : rightEndIcon;
      // Check if its an intermediate card
      if (index + 1 == trainingsCompleted)
        return quizPassed ? rightCompleted : rightInter;

      return index === trainingsCompleted ? horizontalIcon : rightCompleted;
    }

    // Incomplete middle icons
    return index == numTrainings ? rightEndIcon : horizontalIcon;
  }
  // Reversed
  else {
    // Left most icon
    if ((index + 1) % imagesPerRow == 0) {
      // Check if icon should be intermediate or completed
      if (index <= trainingsCompleted && trainingsCompleted != 0) {
        // Check if final icon
        if (index === numTrainings)
          return quizPassed ? leftTrophy : leftEndIcon;
        // Check if icon is intermediate
        if (index + 1 === trainingsCompleted)
          return quizPassed ? leftDownCompleted : leftDownInter;

        // Check if the icon is not started or already completed
        return index == trainingsCompleted ? leftDownIcon : leftDownCompleted;
      }
      // Not started yet
      return index === numTrainings ? leftEndIcon : leftDownIcon;
      // Right most icon
    } else if (index % imagesPerRow === 0) {
      // Check if icon should be intermediate or completed
      if (index <= trainingsCompleted && trainingsCompleted != 0) {
        // Check if icon is final
        if (index === numTrainings)
          return quizPassed ? downTrophy : downEndIcon;
        // Check if icon is an intermediate card
        if (index + 1 === trainingsCompleted)
          return quizPassed ? downLeftCompleted : downLeftInter;

        return index === trainingsCompleted ? downLeftIcon : downLeftCompleted;
      }

      return index === numTrainings ? downEndIcon : downLeftIcon;
    }

    // Middle icons
    if (index <= trainingsCompleted && trainingsCompleted != 0) {
      // Check for trophy
      if (index == numTrainings) return quizPassed ? leftTrophy : leftEndIcon;
      // Check if its an intermediate card
      if (index + 1 == trainingsCompleted)
        return quizPassed ? leftCompleted : leftInter;

      return index === trainingsCompleted ? horizontalIcon : leftCompleted;
    }

    return index === numTrainings ? leftEndIcon : horizontalIcon;
  }
}

const PathwayTile: React.FC<PathwayTileProps> = ({
  tileNum,
  pathwayID,
  trainingID,
  width,
  numTrainings,
  trainingsCompleted,
  quizPassed,
  volunteerTrainings,
  volunteerPathway,
  setSnackbar,
  setSnackbarMessage,
  setPopupOpen,
}) => {
  const [openTrainingPopup, setOpenTrainingPopup] = useState<boolean>(false);
  const [volunteerTrainingRecord, setVolunteerTrainingRecord] =
    useState<VolunteerTraining>();
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const imgWidth = 300;
  const navigate = useNavigate();
  const auth = useAuth();

  const imagesPerRow = Math.floor(width / imgWidth);
  const image = getImage(
    imagesPerRow,
    tileNum,
    numTrainings,
    trainingsCompleted,
    quizPassed
  );

  const handleQuizClick = () => {
    if (trainingsCompleted !== numTrainings) {
      setSnackbarMessage(
        "Please complete all trainings to unlock the pathway quiz"
      );
      setSnackbar(true);
    } else if (volunteerPathway.pathwayID !== "") {
      navigate(`/pathways/quizlanding`, {
        state: {
          pathway: pathwayID,
          volunteerPathway: volunteerPathway,
          fromApp: true,
        },
      });
    }
  };

  useEffect(() => {
    if (trainingID && volunteerTrainings.includes(trainingID.id)) {
      getVolunteer(auth.id.toString())
        .then((volunteer) => {
          const volunteerTraining = volunteer.trainingInformation;

          if (volunteerTraining) {
            const training = volunteerTraining.find(
              (training) => training.trainingID === trainingID.id
            );
            setVolunteerTrainingRecord(training);
          }
        })
        .catch((error) => {
          console.error("Error fetching volunteer:", error);
        });
    }
  }, [volunteerTrainings, auth.id, trainingID]);

  return (
    <>
      <div
        className={styles.tile}
        onClick={() => {
          setOpenTrainingPopup(true);
          setPopupOpen(true);
          // Clicking on the quiz tile
          if (image.includes("End") || image.includes("Trophy")) {
            handleQuizClick();
          }
        }}>
        <Tooltip
          title={
            image.includes("End") || image.includes("Trophy")
              ? "Quiz"
              : trainingID?.name
          }
          arrow={false}
          onMouseMove={(e) => setPosition({ x: e.pageX, y: e.pageY })}
          PopperProps={{
            anchorEl: {
              clientHeight: 0,
              clientWidth: 0,
              getBoundingClientRect: () => ({
                top: position.y,
                left: position.x,
                right: position.x,
                bottom: position.y,
                width: 0,
                height: 0,
                x: position.x,
                y: position.y,
                toJSON: () => {},
              }),
            },
          }}
          componentsProps={{
            tooltip: {
              sx: {
                ...grayTooltip,
                maxWidth: "350px",
                "&:hover": {
                  cursor: "pointer",
                },
              },
            },
          }}>
          <img
            src={image}
            className={`${styles.tileImage} ${
              image !== emptyIcon ? styles.cursorPointer : ""
            }`}
          />
        </Tooltip>

        <div className={styles.trainingNumber}>
          {trainingID != null && tileNum >= trainingsCompleted
            ? tileNum + 1
            : ""}
        </div>
      </div>
      {trainingID ? (
        volunteerTrainingRecord ? (
          <PathwayTrainingPopup
            open={openTrainingPopup}
            onClose={() => {
              setOpenTrainingPopup(false);
              setPopupOpen(false);
            }}
            record={trainingID}
            volunteerRecord={volunteerTrainingRecord}
            mode={"training"}
          />
        ) : (
          <PathwayTrainingPopup
            open={openTrainingPopup}
            onClose={() => {
              setOpenTrainingPopup(false);
              setPopupOpen(false);
            }}
            record={trainingID}
            mode={"training"}
          />
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default PathwayTile;

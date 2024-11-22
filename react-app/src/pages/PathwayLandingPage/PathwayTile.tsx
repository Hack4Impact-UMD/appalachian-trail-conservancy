import React from "react";
import styles from "./PathwayTile.module.css";
import emptyIcon from "../../assets/PathwayTiles/Empty.svg";
import downEndIcon from "../../assets/PathwayTiles/DownEnd.svg";
import downLeftIcon from "../../assets/PathwayTiles/DownLeft.svg";
import downRightIcon from "../../assets/PathwayTiles/DownRight.svg";
import horizontalIcon from "../../assets/PathwayTiles/Horizontal.svg";
import leftDownIcon from "../../assets/PathwayTiles/LeftDown.svg";
import leftEndIcon from "../../assets/PathwayTiles/LeftEnd.svg";
import rightDownIcon from "../../assets/PathwayTiles/RightDown.svg";
import rightEndIcon from "../../assets/PathwayTiles/RightEnd.svg";
import verticalIcon from "../../assets/PathwayTiles/Vertical.svg";
import TrainingPopup from "../../components/TrainingPopup/TrainingPopup";
import downLeftCompleted from "../../assets/PathwayTiles/DownLeftCompleted.svg";
import downTrophy from "../../assets/PathwayTiles/DownTrophy.svg";
import leftDownCompleted from "../../assets/PathwayTiles/LeftDownCompleted.svg"; 
import rightDownCompleted from "../../assets/PathwayTiles/RightDownCompleted.svg";
import verticalCompleted from "../../assets/PathwayTiles/VerticalCompleted.svg";
import downRightCompleted from "../../assets/PathwayTiles/DownRightCompleted.svg";
import horizontalCompleted from "../../assets/PathwayTiles/HorizontalCompleted.svg";
import leftTrophy from "../../assets/PathwayTiles/LeftTrophy.svg";
import rightTrophy from "../../assets/PathwayTiles/RightTrophy.svg";
import { useState } from "react";
import { TrainingID } from "../../types/TrainingType";

interface PathwayTileProps {
  tileNum: number; // index of the tile
  trainingID?: TrainingID; // training id of the specific training
  width: number; // width of the div
  numTrainings: number; // total number of trainings in this pathway
  trainingsCompleted: number;
}

// imagesPerRow: the total number of images per row, used to identify which direction
// index: specific index of the training in pathway
// count: total number of trainings in pathway
// trainingsCompleted: the number of trainings in this pathway that have been finished
function getImage(imagesPerRow: number, index: number, numTrainings: number, trainingsCompleted: number) {
  // Empty
  if (index > numTrainings) return emptyIcon;
  // Straight down
  if (imagesPerRow == 1) {
    // Check if they're finished
    // if (index < trainingsCompleted) {
    //   return index == numTrainings ? downTrophy : verticalCompleted;
    // }
    return index == numTrainings ? downEndIcon : verticalIcon;
  }
  // Not reversed
  if (Math.floor(index / imagesPerRow) % 2 == 0) {
    // Right-most card
    if ((index + 1) % imagesPerRow == 0) {
      // if (index < trainingsCompleted) {
      //  return index == numTrainings ? leftTrophy : rightDownCompleted;
      // }
      return index == numTrainings ? leftEndIcon : rightDownIcon;
      // Left-most icon
    } else if (index % imagesPerRow == 0) {
      if (index == 0) {
        // return index < numCompleted : horizonalCompleted ? horizontalIcon; // insert check for finished the first one
        return horizontalIcon;
      } else {
        // if (index < trainingsCompleted) {
        // }
        return index == numTrainings ? downEndIcon : downRightIcon;
      }
    }
    return index == numTrainings ? leftEndIcon : horizontalIcon;
  }
  // Reversed
  else {
    if ((index + 1) % imagesPerRow == 0) {
      return index == numTrainings ? rightEndIcon : leftDownIcon;
    } else if (index % imagesPerRow == 0) {
      return index == numTrainings ? downEndIcon : downLeftIcon;
    }

    return index == numTrainings ? rightEndIcon : horizontalIcon;
  }
}

const PathwayTile: React.FC<PathwayTileProps> = ({
  tileNum,
  trainingID,
  width,
  numTrainings,
  trainingsCompleted,
}) => {
  const [openTrainingPopup, setOpenTrainingPopup] = useState<boolean>(false);
  const imgWidth = 300;

  const imagesPerRow = Math.floor(width / imgWidth);
  const image = getImage(imagesPerRow, tileNum, numTrainings, 1);
  //console.log(tileNum +"num")

  return (
    <>
      <div
        style={{
          position: "relative",
          lineHeight: 0,
        }}
        onClick={() => {
          setOpenTrainingPopup(true);
        }}
      >
        <img src={image} style={{ width: "300px", height: "300px" }} />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "3rem",
            fontWeight: "bold",
          }}
        >
          {trainingID != null ? tileNum + 1 : ""}
        </div>
      </div>
      {trainingID ? (
        <TrainingPopup
          open={openTrainingPopup}
          onClose={setOpenTrainingPopup}
          training={trainingID}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default PathwayTile;

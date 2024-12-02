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

import downLeftCompleted from "../../assets/PathwayTiles/CompletedTiles/DownLeftCompleted.svg"; 
import downTrophy from "../../assets/PathwayTiles/CompletedTiles/DownTrophy.svg";
import leftDownCompleted from "../../assets/PathwayTiles/CompletedTiles/LeftDownCompleted.svg"; 
import rightDownCompleted from "../../assets/PathwayTiles/CompletedTiles/RightDownCompleted.svg";
import verticalCompleted from "../../assets/PathwayTiles/CompletedTiles/VerticalCompleted.svg";
import downRightCompleted from "../../assets/PathwayTiles/CompletedTiles/DownRightCompleted.svg";
import leftCompleted from "../../assets/PathwayTiles/CompletedTiles/LeftCompleted.svg";
import leftTrophy from "../../assets/PathwayTiles/CompletedTiles/LeftTrophy.svg";
import rightTrophy from "../../assets/PathwayTiles/CompletedTiles/RightTrophy.svg";

import downLeftInter from "../../assets/PathwayTiles/IntermediateTiles/DownLeftInter.svg";
import downRightInter from "../../assets/PathwayTiles/IntermediateTiles/DownRightInter.svg";
import leftInter from "../../assets/PathwayTiles/IntermediateTiles/LeftInter.svg";
import rightInter from "../../assets/PathwayTiles/IntermediateTiles/RightInter.svg";
import leftDownInter from "../../assets/PathwayTiles/IntermediateTiles/LeftDownInter.svg";
import rightDownInter from "../../assets/PathwayTiles/IntermediateTiles/RightDownInter.svg";
import verticalInter from "../../assets/PathwayTiles/IntermediateTiles/VerticalInter.svg";
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
  console.log("card index " + index);
  // console.log("num trainings " + numTrainings);
  // Empty
  if (index > numTrainings) return emptyIcon;
  // Straight down
  if (imagesPerRow === 1) {
    // // Check if the current tile is finished
    // if (index <= trainingsCompleted) {
    //   // Check if all tiles have been finished
    //   if (index + 1 == trainingsCompleted )

    //   // Check if this is the msot recent tile to be finished
    //   if (index )
    // }

    // Check that the index has been completed
    if (index <= trainingsCompleted && trainingsCompleted != 0) {
      // Check if it is the final  one
      if (index === numTrainings)
        return downTrophy;
      // Check if it is the last one in the sequence
      if (index + 1 === trainingsCompleted)
        return verticalInter;
      
      // Otherwise it is done and the one behind it is to
      return verticalCompleted;
    }

    return index === numTrainings ? downEndIcon : verticalIcon;
  }
  // Not reversed
  if (Math.floor(index / imagesPerRow) % 2 === 0) {
    // Right-most card
    if ((index + 1) % imagesPerRow === 0) {
      // Check if this has been completed yet
      if (index <= trainingsCompleted && trainingsCompleted != 0) {
        // Check if this is the last one completed
        if (index === numTrainings)
          return rightTrophy;
        //
        if (index + 1 === trainingsCompleted) 
          return rightDownInter;

        return rightDownCompleted;
      }
      return index === numTrainings ? leftEndIcon : rightDownIcon;
      // Left-most icon
    } else if (index % imagesPerRow === 0) {
        //
        if (index <= trainingsCompleted && trainingsCompleted != 0) {
          //
          if (index === numTrainings)
            return leftTrophy;
          //

          if (index === 0)
            return index + 1 === numTrainings ? leftInter : leftCompleted;

          if (index + 1 === trainingsCompleted)
            return leftDownInter;
          
          return leftDownCompleted;
        }

      if (index === 0) {
        return horizontalIcon;
      } else {
        // if (index < trainingsCompleted) {
        // }
        return index === numTrainings ? downEndIcon : downRightIcon;
      }
    }

    // Middle icons
    if (index + 1 <= trainingsCompleted && trainingsCompleted != 0) {
      return leftCompleted;
    }

    return index == numTrainings ? leftEndIcon : horizontalIcon;
  }
  // Reversed
  else {
    // Left most icon
    if ((index + 1) % imagesPerRow == 0) {
      if (index <= trainingsCompleted && trainingsCompleted != 0) {
        if (index ===numTrainings)
          return leftTrophy;
        
        if (index + 1 === trainingsCompleted)
          return leftDownInter;

        return leftDownCompleted;
      }
      return index === numTrainings ? rightEndIcon : leftDownIcon;
    } else if (index % imagesPerRow === 0) {
      if (index <= trainingsCompleted && trainingsCompleted != 0) {
        if (index === numTrainings)
          return leftTrophy;

        if (index + 1 === trainingsCompleted)
          return downLeftInter;

        return downLeftCompleted;
      }

      return index === numTrainings ? downEndIcon : downLeftIcon;
    }

    if (index + 1 <= trainingsCompleted && trainingsCompleted != 0) {
      return rightInter; // TODO: right completed goes here
    }

    return index === numTrainings ? rightEndIcon : horizontalIcon; 
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
  const image = getImage(imagesPerRow, tileNum, numTrainings, trainingsCompleted);
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
          {trainingID != null && tileNum >= trainingsCompleted ? tileNum + 1 : ""}
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

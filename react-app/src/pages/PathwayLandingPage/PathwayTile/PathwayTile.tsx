import React from "react";
import emptyIcon from "../../../assets/PathwayTiles/Empty.svg";
import downEndIcon from "../../../assets/PathwayTiles/DownEnd.svg";
import downLeftIcon from "../../../assets/PathwayTiles/DownLeft.svg";
import downRightIcon from "../../../assets/PathwayTiles/DownRight.svg";
import horizontalIcon from "../../../assets/PathwayTiles/Horizontal.svg";
import leftDownIcon from "../../../assets/PathwayTiles/LeftDown.svg";
import leftEndIcon from "../../../assets/PathwayTiles/LeftEnd.svg";
import rightDownIcon from "../../../assets/PathwayTiles/RightDown.svg";
import rightEndIcon from "../../../assets/PathwayTiles/RightEnd.svg";
import verticalIcon from "../../../assets/PathwayTiles/Vertical.svg";
import PathwayTrainingPopup from "../../../components/PathwayTrainingPopup/PathwayTrainingPopup";

import downLeftCompleted from "../../../assets/PathwayTiles/CompletedTiles/DownLeftCompleted.svg";
import downTrophy from "../../../assets/PathwayTiles/CompletedTiles/DownTrophy.svg";
import leftDownCompleted from "../../../assets/PathwayTiles/CompletedTiles/LeftDownCompleted.svg";
import rightDownCompleted from "../../../assets/PathwayTiles/CompletedTiles/RightDownCompleted.svg";
import verticalCompleted from "../../../assets/PathwayTiles/CompletedTiles/VerticalCompleted.svg";
import downRightCompleted from "../../../assets/PathwayTiles/CompletedTiles/DownRightCompleted.svg";
import leftCompleted from "../../../assets/PathwayTiles/CompletedTiles/LeftCompleted.svg";
import rightCompleted from "../../../assets/PathwayTiles/CompletedTiles/RightCompleted.svg";
import leftTrophy from "../../../assets/PathwayTiles/CompletedTiles/LeftTrophy.svg";
import rightTrophy from "../../../assets/PathwayTiles/CompletedTiles/RightTrophy.svg";

import downLeftInter from "../../../assets/PathwayTiles/IntermediateTiles/DownLeftInter.svg";
import downRightInter from "../../../assets/PathwayTiles/IntermediateTiles/DownRightInter.svg";
import leftInter from "../../../assets/PathwayTiles/IntermediateTiles/LeftInter.svg";
import rightInter from "../../../assets/PathwayTiles/IntermediateTiles/RightInter.svg";
import leftDownInter from "../../../assets/PathwayTiles/IntermediateTiles/LeftDownInter.svg";
import rightDownInter from "../../../assets/PathwayTiles/IntermediateTiles/RightDownInter.svg";
import verticalInter from "../../../assets/PathwayTiles/IntermediateTiles/VerticalInter.svg";
import { useState } from "react";
import { TrainingID } from "../../../types/TrainingType";

/*
Cards are inconsistently labelled. For some cards, the directions indicate the 
footstep order while others don't. rightDownCompleted has the steps going:
right, down
while leftCompleted are going to the right?
*/

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
function getImage(
  imagesPerRow: number,
  index: number,
  numTrainings: number,
  trainingsCompleted: number
) {
  // Empty
  if (index > numTrainings) return emptyIcon;
  // Straight down
  if (imagesPerRow === 1) {
    // Check that the index has been completed
    if (index <= trainingsCompleted && trainingsCompleted != 0) {
      // Check if it is the final  one
      if (index === numTrainings) return downTrophy;
      // Check if it is the last one in the sequence
      if (index + 1 === trainingsCompleted) return verticalInter;

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
        if (index === numTrainings) return rightTrophy;
        // Check if this icon is the most recent completed
        if (index + 1 === trainingsCompleted) return rightDownInter;

        // Check if this should be a normal icon or completed
        return index === trainingsCompleted
          ? rightDownIcon
          : rightDownCompleted;
      }
      return index === numTrainings ? leftEndIcon : rightDownIcon;
      // Left-most icon
    } else if (index % imagesPerRow === 0) {
      // Check if either intermediate icon or completed icon
      if (index <= trainingsCompleted && trainingsCompleted != 0) {
        // Check if this is the final one
        if (index === numTrainings)
          // Check if it is going down or not
          return index > 0 ? downTrophy : rightTrophy;
        // Check if this icon is the first icon and whether it's an intermediate
        if (index === 0)
          return index + 1 === trainingsCompleted ? leftInter : leftCompleted;
        // Check if this is an intermediate icon
        if (index + 1 === trainingsCompleted) return downRightInter;

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
      if (index == numTrainings) return rightTrophy;
      // Check if its an intermediate card
      if (index + 1 == trainingsCompleted) return leftInter;

      return index === trainingsCompleted ? horizontalIcon : leftCompleted;
    }

    // Incomplete middle icons
    return index == numTrainings ? leftEndIcon : horizontalIcon;
  }
  // Reversed
  else {
    // Left most icon
    if ((index + 1) % imagesPerRow == 0) {
      // Check if icon should be intermediate or completed
      if (index <= trainingsCompleted && trainingsCompleted != 0) {
        // Check if final icon
        if (index === numTrainings) return leftTrophy;
        // Check if icon is intermediate
        if (index + 1 === trainingsCompleted) return leftDownInter;

        // Check if the icon is not started or already completed
        return index == trainingsCompleted ? leftDownIcon : leftDownCompleted;
      }
      // Not started yet
      return index === numTrainings ? rightEndIcon : leftDownIcon;
      // Right most icon
    } else if (index % imagesPerRow === 0) {
      // Check if icon should be intermediate or completed
      if (index <= trainingsCompleted && trainingsCompleted != 0) {
        // Check if icon is final
        if (index === numTrainings) return downTrophy;
        // Check if icon is an intermediate card
        if (index + 1 === trainingsCompleted) return downLeftInter;

        return index === trainingsCompleted ? downLeftIcon : downLeftCompleted;
      }

      return index === numTrainings ? downEndIcon : downLeftIcon;
    }

    // Middle icons
    if (index <= trainingsCompleted && trainingsCompleted != 0) {
      // Check for trophy
      if (index == numTrainings) return leftTrophy;
      // Check if its an intermediate card
      if (index + 1 == trainingsCompleted) return rightInter;

      return index === trainingsCompleted ? horizontalIcon : rightCompleted;
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
  const image = getImage(
    imagesPerRow,
    tileNum,
    numTrainings,
    trainingsCompleted
  );

  return (
    <>
      <div
        style={{
          position: "relative",
          lineHeight: 0,
        }}
        onClick={() => {
          setOpenTrainingPopup(true);
        }}>
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
          }}>
          {trainingID != null && tileNum >= trainingsCompleted
            ? tileNum + 1
            : ""}
        </div>
      </div>
      {trainingID ? (
        <PathwayTrainingPopup
          open={openTrainingPopup}
          onClose={setOpenTrainingPopup}
          record={trainingID}
          mode={"training"}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default PathwayTile;

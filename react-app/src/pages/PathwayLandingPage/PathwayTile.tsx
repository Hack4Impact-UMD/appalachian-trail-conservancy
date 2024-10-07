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
import { useState } from "react";
import { TrainingID } from "../../types/TrainingType";

interface PathwayTileProps {
  tileNum: number;
  trainingID?: TrainingID;
  space: number;
  count: number;
}

function getImage(imagesPerRow: number, num: number, count: number) {
  // Empty
  if (num > count) 
    return emptyIcon;
  // Straight down
  if (imagesPerRow == 1)
    return num == count ? downEndIcon : verticalIcon;
  // Not reversed
  if (Math.floor(num / imagesPerRow) % 2 == 0) {
    if ((num + 1) % imagesPerRow == 0) {
      return num == count ? leftEndIcon : rightDownIcon;
    }
    else if (num % imagesPerRow == 0){
      if (num == 0) {
        return horizontalIcon;
      }
      else {
        return num == count ? downEndIcon : downRightIcon;
      }
    }
    return num == count ? leftEndIcon : horizontalIcon;
  }
  // Reversed
  else {
    if ((num + 1) % imagesPerRow == 0) {
      return num + 1 == count ? rightEndIcon : leftDownIcon;
    }
    else if (num % imagesPerRow == 0) {
      return num == count ? downEndIcon : downLeftIcon;
    }

    return num  == count ? rightEndIcon : horizontalIcon;
  }
}

const PathwayTile: React.FC<PathwayTileProps> = ({
  tileNum,
  trainingID,
  space,
  count,
}) => {
  const [openTrainingPopup, setOpenTrainingPopup] = useState<boolean>(false);
  const imgWidth = 300;

  const imagesPerRow = Math.floor(space / imgWidth);
  const image = getImage(imagesPerRow, tileNum, count);
  console.log(tileNum +"num")

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
        <img src={image} style={{ width: "300px" , height: "300px"}} />
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
          {trainingID !=  null ? tileNum + 1: ""}
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

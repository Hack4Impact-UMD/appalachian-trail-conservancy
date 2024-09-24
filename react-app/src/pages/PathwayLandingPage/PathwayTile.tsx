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
  trainingID: TrainingID;
  space: number;
  count: number;
}

function getImage(x, y, row) {
  if (row == 1) {


  }
  else {


  } 
}

const PathwayTile: React.FC<PathwayTileProps> = ({ tileNum, trainingID, space, count }) => {
  const [openTrainingPopup, setOpenTrainingPopup] = useState<boolean>(false);
  const imgWidth = 429;

  const imagesPerRow = (space / imgWidth);
  const y = (tileNum) / imagesPerRow;
  const x = y % 2 == 0 ? tileNum % imagesPerRow : imagesPerRow - (tileNum % imagesPerRow) - 1;


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
        <img src={horizontalIcon} style={{ width: "100%" }} />
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
          {tileNum}
        </div>
      </div>
      <TrainingPopup
        open={openTrainingPopup}
        onClose={setOpenTrainingPopup}
        training={trainingID}
      />
    </>
  );
};

export default PathwayTile;

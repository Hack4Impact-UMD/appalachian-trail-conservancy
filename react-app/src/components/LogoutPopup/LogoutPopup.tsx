import styles from "./LogoutPopup.module.css";
import { Button } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { whiteButtonGrayBorder } from "../../muiTheme";
import { forestGreenButton } from "../../muiTheme";
import { Link } from "react-router-dom";
import React from "react";
import { logOut } from "../../backend/AuthFunctions";
import Modal from "../ModalWrapper/Modal";

interface modalPropsType {
  open: boolean;
  onClose: any;
}

const LogoutPopup = ({ open, onClose }: modalPropsType): React.ReactElement => {
  function startLogOut() {
    logOut().catch((error) => {
      console.log(error);
    });
  }

  return (
    <Modal
      height={400}
      open={open}
      onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClose();
      }}
    >
      <div className={styles.title}>
        <p> Are you sure you want to log out?</p>
      </div>
      <div className={styles.buttons}>
        <div className={styles.leftButton}>
          <Button
            onClick={() => onClose()}
            variant="contained"
            sx={{ ...whiteButtonGrayBorder, width: "100px" }}
          >
            Cancel
          </Button>
        </div>
        <div className={styles.rightButton}>
          <Link to="/logout">
            <Button
              onClick={() => startLogOut()}
              variant="contained"
              sx={{ ...forestGreenButton, width: "100px" }}
            >
              Confirm
            </Button>
          </Link>
        </div>
      </div>
      <div className={styles.closeButton}>
        <IoCloseOutline onClick={() => onClose()} />
      </div>
    </Modal>
  );
};

LogoutPopup.defaultProps = {
  width: 800,
};

Modal.defaultProps = {
  width: 600,
};

export default LogoutPopup;

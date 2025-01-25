import styles from "./LogoutPopup.module.css";
import { Button } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { whiteButtonGrayBorder, forestGreenButton } from "../../muiTheme";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { logOut } from "../../backend/AuthFunctions";
import Modal from "../ModalWrapper/Modal";

interface modalPropsType {
  open: boolean;
  onClose: any;
}

const LogoutPopup = ({ open, onClose }: modalPropsType): React.ReactElement => {
  const navigate = useNavigate();

  function startLogOut() {
    logOut()
      .then(() => {
        navigate("/logout", { state: { fromApp: true } });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Modal
      height={250}
      width={450}
      open={open}
      onClose={() => {
        onClose();
      }}>
      <div className={styles.content}>
        <p className={styles.title}> Are you sure you want to log out?</p>
        <div className={styles.buttons}>
          <div className={styles.leftButton}>
            <Button
              onClick={() => onClose()}
              variant="contained"
              sx={{ ...whiteButtonGrayBorder, width: "100px" }}>
              Cancel
            </Button>
          </div>
          <div className={styles.rightButton}>
            <Link to="/logout">
              <Button
                onClick={() => startLogOut()}
                variant="contained"
                sx={{ ...forestGreenButton, width: "100px" }}>
                Confirm
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.closeButton}>
        <IoCloseOutline onClick={() => onClose()} />
      </div>
    </Modal>
  );
};

export default LogoutPopup;

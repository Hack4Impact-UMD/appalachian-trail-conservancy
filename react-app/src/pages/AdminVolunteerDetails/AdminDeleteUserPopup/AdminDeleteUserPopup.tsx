import styles from "./AdminDeleteUserPopup.module.css";
import { Button } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { whiteButtonGrayBorder, forestGreenButton } from "../../../muiTheme";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { logOut } from "../../../backend/AuthFunctions";
import Modal from "../../../components/ModalWrapper/Modal";

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
      }}
    >
      <div className={styles.content}>
        <p className={styles.title}>ARE YOU SURE YOU WANT TO DELETE THIS VOLUNTEER?</p>
        <p className={styles.text}>This action cannot be undone.</p>
        <div className={styles.buttons}>
          <div className={styles.leftButton}>
            <Button
              onClick={() => onClose()}
              variant="contained"
              sx={{ ...whiteButtonGrayBorder, width: "100px", 
                color: "white",
                  backgroundColor: "gray",
                  border: "2px solid gray",
                  "&:hover": {
                    color: "gray",
                    border: "2px solid gray",
                    backgroundColor: "white"
                  }, 
              }}
            >
              Cancel
            </Button>
          </div>
          <div className={styles.rightButton}>
            <Link to="/logout">
              <Button
                onClick={() => startLogOut()}
                variant="contained"
                sx={{ ...forestGreenButton, width: "100px",    
                  color: "white",
                  backgroundColor: "#BF3232",
                  border: "2px solid #BF3232",
                  "&:hover": {
                    color: "#BF3232",
                    border: "2px solid #BF3232",
                    backgroundColor: "white"
                  }, 
                }}
              >
                Yes
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

import styles from "./AdminDeleteUserPopup.module.css";
import { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { whiteButtonGrayBorder, hazardRedButton } from "../../../muiTheme";
import { useNavigate } from "react-router";
import Modal from "../../../components/ModalWrapper/Modal";
import Loading from "../../../components/LoadingScreen/Loading";
import { deleteUser } from "../../../backend/AuthFunctions";

interface modalPropsType {
  open: boolean;
  onClose: any;
  volunteerAuthId: string;
}

const DeleteUserPopup = ({
  open,
  onClose,
  volunteerAuthId,
}: modalPropsType): React.ReactElement => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [canClose, setCanClose] = useState<boolean>(true); // can close modal state
  const [snackbar, setSnackbar] = useState(false);

  const deleteVolunteer = async () => {
    try {
      setCanClose(false);
      setLoading(true);
      await deleteUser(volunteerAuthId);
      navigate("/management", {
        state: { fromApp: true, showSnackbar: true }, //use state to pass that it should show snackbar
      });
    } catch (error) {
      setLoading(false);
      setCanClose(true);
      setSnackbar(true);
    }
  };

  return (
    <>
      <Modal
        height={270}
        open={open}
        onClose={() => {
          if (canClose) {
            onClose();
          }
        }}>
        <div className={styles.content}>
          <p className={styles.title}>
            ARE YOU SURE YOU WANT TO DELETE THIS VOLUNTEER?
          </p>
          <p className={styles.text}>This action cannot be undone.</p>
          <div className={styles.buttons}>
            <div className={styles.leftButton}>
              <Button
                onClick={() => onClose()}
                variant="contained"
                disabled={loading}
                sx={{
                  ...whiteButtonGrayBorder,
                  width: "100px",
                }}>
                CANCEL
              </Button>
            </div>
            <div className={styles.rightButton}>
              <Button
                onClick={() => deleteVolunteer()}
                variant="contained"
                disabled={loading}
                sx={{
                  ...hazardRedButton,
                  width: "100px",
                }}>
                {loading ? <Loading /> : "YES"}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.closeButton}>
          <IoCloseOutline
            onClick={() => {
              if (canClose) {
                onClose();
              }
            }}
          />
        </div>
      </Modal>
      <Snackbar
        open={snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position within the right section
      >
        <Alert onClose={() => setSnackbar(false)} severity={"error"}>
          Error deleting volunteer. Please try again.
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeleteUserPopup;

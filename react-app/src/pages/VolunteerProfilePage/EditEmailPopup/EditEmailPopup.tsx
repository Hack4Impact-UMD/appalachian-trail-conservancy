import { useState } from "react";
import styles from "./EditEmailPopup.module.css";
import Modal from "../../../components/ModalWrapper/Modal";
import Loading from "../../../components/LoadingScreen/Loading";
import { useAuth } from "../../../auth/AuthProvider";
import { Button } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { whiteButtonGrayBorder, forestGreenButton } from "../../../muiTheme";
import { Volunteer } from "../../../types/UserType";
import { sendChangeEmailLink } from "../../../backend/AuthFunctions";

interface modalPropsType {
  open: boolean;
  onClose: any;
  volunteer: Volunteer | undefined;
  setSnackbar: any;
  setSnackbarMessage: any;
}

const EditEmailPopup = ({
  open,
  onClose,
  volunteer,
  setSnackbar,
  setSnackbarMessage,
}: modalPropsType): React.ReactElement => {
  const auth = useAuth();

  // loading state
  const [loading, setLoading] = useState<boolean>(false);

  // can close modal state
  const [canClose, setCanClose] = useState<boolean>(true);

  // handle opening of snackbar and loading and canClose state
  const handlePostEvent = (success: boolean = false) => {
    setSnackbar(true);
    setLoading(false);
    setCanClose(true);

    if (success) onClose();
  };

  const handleSendEmail = () => {
    // set loading and canClose to false
    setCanClose(false);
    setLoading(true);
    let success = false;

    if (volunteer) {
      sendChangeEmailLink(volunteer.email)
        .then(() => {
          setSnackbarMessage("Change email link successfully sent");
          success = true;
        })
        .catch((error) => {
          setSnackbarMessage(
            "Error sending change email link. Please try again."
          );
        })
        .finally(() => {
          handlePostEvent(success);
        });
    } else {
      setSnackbarMessage("Error retrieving user. Please try again.");
      handlePostEvent(success);
    }
  };

  const handleClose = () => {
    if (!loading && canClose) {
      onClose();
    }
  };

  return (
    <Modal
      height={270}
      open={open}
      onClose={() => {
        handleClose();
      }}>
      <div className={styles.content}>
        <p className={styles.title}>Change Email</p>
        <p className={styles.message}>
          We'll send a link to
          <br />
          <span className={styles.greenText}>{volunteer?.email}</span>
          <br />
          to change your email.
        </p>
        <div className={styles.buttons}>
          <Button
            onClick={() => handleClose()}
            variant="contained"
            sx={{ ...whiteButtonGrayBorder, width: "120px" }}
            disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ ...forestGreenButton, width: "120px" }}
            onClick={handleSendEmail}
            disabled={loading}>
            {loading ? <Loading /> : "Send Link"}
          </Button>
        </div>
      </div>
      <div className={styles.closeButton}>
        <IoCloseOutline onClick={() => handleClose()} />
      </div>
    </Modal>
  );
};

export default EditEmailPopup;

import { useState, useRef } from "react";
import styles from "./EditEmailPopup.module.css";
import Modal from "../../../components/ModalWrapper/Modal";
import Loading from "../../../components/LoadingScreen/Loading";
import { useAuth } from "../../../auth/AuthProvider";
import { Button, TextField } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import {
  whiteButtonGrayBorder,
  forestGreenButton,
  grayBorderTextField,
} from "../../../muiTheme";
import { Volunteer } from "../../../types/UserType";
import {
  authenticateUserEmailAndPassword,
  updateUserEmail,
} from "../../../backend/AuthFunctions";

interface modalPropsType {
  open: boolean;
  onClose: any;
  volunteer: Volunteer | undefined;
  setVolunteer: any;
  setSnackbar: any;
  setSnackbarMessage: any;
}

const EditEmailPopup = ({
  open,
  onClose,
  volunteer,
  setVolunteer,
  setSnackbar,
  setSnackbarMessage,
}: modalPropsType): React.ReactElement => {
  const auth = useAuth();

  // loading state
  const [loading, setLoading] = useState<boolean>(false);

  // can close modal state
  const [canClose, setCanClose] = useState<boolean>(true);

  const prevCredRef = useRef();
  const newCredRef = useRef();

  // handle opening of snackbar and loading and canClose state
  const handlePostEvent = (success: boolean = false) => {
    setSnackbar(true);
    setLoading(false);
    setCanClose(true);

    if (success) onClose();
  };

  // Check if email is valid
  const validateEmail = (email: string) => {
    const pattern = /^[^@]+@[^@]+\.[^@]+$/;
    return pattern.test(email);
  };

  const updateEmail = (newEmail: string, confirmEmail: string) => {
    // check if any field is empty
    if (newEmail === "" || confirmEmail === "") {
      setSnackbarMessage("Please fill out all fields");
      handlePostEvent();
      return;
    }

    // validate string are emails
    if (!validateEmail(newEmail) || !validateEmail(confirmEmail)) {
      setSnackbarMessage("Invalid email format");
      handlePostEvent();
      return;
    }

    // check if new email and confirm email are the same
    if (newEmail !== confirmEmail) {
      setSnackbarMessage("Emails do not match");
      handlePostEvent();
      return;
    }

    let success = false;

    // authenticateUserEmailAndPassword(auth.user.email!, password)
    //   .then(async () => {
    //     await updateUserEmail(auth.user.email!, newEmail)
    //       .then(() => {
    //         success = true; // Set success to true to close popup
    //         setSnackbarMessage("Email updated successfully");
    //         setVolunteer({ ...volunteer, email: newEmail });
    //         auth.setUser({ ...auth.user, email: newEmail }); // Update user email in auth context
    //       })
    //       .catch((e) => {
    //         console.error(e);
    //         setSnackbarMessage("Failed to update email. Try again later.");
    //       });
    //   })
    //   .catch(() => {
    //     setSnackbarMessage("Incorrect password");
    //   })
    //   .finally(() => {
    //     handlePostEvent(success);
    //   });
  };

  const handleUpdateCredential = () => {
    // set loading and canClose to false
    setCanClose(false);
    setLoading(true);

    //@ts-ignore
    const prevCred = prevCredRef.current?.value;
    //@ts-ignore
    const newCred = newCredRef.current?.value;
    if (volunteer) {
      updateEmail(prevCred, newCred);
    }
  };

  const handleClose = () => {
    if (!loading && canClose) {
      onClose();
    }
  };

  return (
    <Modal
      height={340}
      open={open}
      onClose={() => {
        handleClose();
      }}>
      <div className={styles.content}>
        <p className={styles.title}>Edit Email</p>
        <div className={styles.textFields}>
          <h3 className={styles.subHeader}>New Email</h3>
          <TextField
            sx={grayBorderTextField}
            className={styles.inputTextField}
            inputRef={prevCredRef}
          />

          <h3 className={styles.subHeader}>Confirm New Email</h3>
          <TextField
            sx={grayBorderTextField}
            className={styles.inputTextField}
            inputRef={newCredRef}
          />
        </div>
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
            onClick={handleUpdateCredential}
            disabled={loading}>
            {loading ? <Loading /> : "Confirm"}
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

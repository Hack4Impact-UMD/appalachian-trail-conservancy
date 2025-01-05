import { useState, useRef } from "react";
import styles from "./EditCredentialPopup.module.css";
import Modal from "../../../components/ModalWrapper/Modal";
import Loading from "../../../components/LoadingScreen/Loading";
import { useAuth } from "../../../auth/AuthProvider";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IoCloseOutline } from "react-icons/io5";
import {
  whiteButtonGrayBorder,
  forestGreenButton,
  grayBorderTextField,
} from "../../../muiTheme";
import { Admin } from "../../../types/UserType";
import { updateAdmin } from "../../../backend/AdminFirestoreCalls";
import {
  authenticateUserEmailAndPassword,
  updateUserEmail,
} from "../../../backend/AuthFunctions";
import { set } from "lodash";

interface modalPropsType {
  open: boolean;
  onClose: any;
  editType: string;
  admin: Admin | undefined;
  setAdmin: any;
  setSnackbar: any;
  setSnackbarMessage: any;
}

const EditCredentialPopup = ({
  open,
  onClose,
  editType,
  admin,
  setAdmin,
  setSnackbar,
  setSnackbarMessage,
}: modalPropsType): React.ReactElement => {
  const auth = useAuth();

  // loading state
  const [loading, setLoading] = useState<boolean>(false);

  // can close modal state
  const [canClose, setCanClose] = useState<boolean>(true);

  const passwordRef = useRef();
  const prevCredRef = useRef();
  const newCredRef = useRef();

  // show password
  const [showPrevPassword, setPrevShowPassword] = useState<boolean>(false);
  const [showNewPassword, setNewShowPassword] = useState<boolean>(false);

  // handle opening of snackbar and loading and canClose state
  const handlePostEvent = () => {
    setSnackbar(true);
    setLoading(false);
    setCanClose(true);
  };

  // Check if email is valid
  const validateEmail = (email: string) => {
    const pattern = /^[^@]+@[^@]+\.[^@]+$/;
    return pattern.test(email);
  };

  const updateEmail = (newEmail: string, confirmEmail: string) => {
    //@ts-ignore
    const password = passwordRef.current?.value;

    // check if any field is empty
    if (newEmail === "" || confirmEmail === "" || password === "") {
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

    authenticateUserEmailAndPassword(auth.user.email!, password)
      .then(async () => {
        await updateUserEmail(auth.user.email!, newEmail)
          .then(() => {
            setPrevShowPassword(false);
            //@ts-ignore
            prevCredRef.current.value = ""; // reset fields
            //@ts-ignore
            newCredRef.current.value = ""; // reset fields
            //@ts-ignore
            passwordRef.current.value = ""; // reset fields
            setSnackbarMessage("Email updated successfully");
            setAdmin({ ...admin, email: newEmail });
            auth.setUser({ ...auth.user, email: newEmail }); // Update user email in auth context
          })
          .catch((e) => {
            console.error(e);
            setSnackbarMessage("Failed to update email. Try again later.");
          });
      })
      .catch(() => {
        setSnackbarMessage("Incorrect password");
      })
      .finally(() => {
        handlePostEvent();
      });
  };

  const updatePassword = (prevPassword: string, newPassword: string) => {
    // TODO
  };

  const handleUpdateCredential = () => {
    // set loading and canClose to false
    setCanClose(false);
    setLoading(true);

    //@ts-ignore
    const prevCred = prevCredRef.current?.value;
    //@ts-ignore
    const newCred = newCredRef.current?.value;
    if (admin) {
      if (editType === "Email") updateEmail(prevCred, newCred);
      else updatePassword(prevCred, newCred);
    }
  };

  const handleClose = () => {
    if (!loading && canClose) {
      setPrevShowPassword(false);
      setNewShowPassword(false);
      onClose();
    }
  };

  return (
    <Modal
      height={editType === "Email" ? 430 : 340}
      width={450}
      open={open}
      onClose={() => {
        handleClose();
      }}
    >
      <div className={styles.content}>
        <p className={styles.title}>Edit {editType}</p>
        <div className={styles.textFields}>
          {/* conditional rendering based on editType */}
          {editType === "Email" ? (
            <>
              <h3 className={styles.subHeader}>Password</h3>
              <TextField
                sx={grayBorderTextField}
                inputRef={passwordRef}
                type={showPrevPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setPrevShowPassword(!showPrevPassword)}
                      >
                        {showPrevPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <h3 className={styles.subHeader}>New Email</h3>
              <TextField sx={grayBorderTextField} inputRef={prevCredRef} />

              <h3 className={styles.subHeader}>Confirm New Email</h3>
              <TextField sx={grayBorderTextField} inputRef={newCredRef} />
            </>
          ) : (
            <>
              <h3 className={styles.subHeader}>Previous {editType}</h3>
              <TextField
                sx={grayBorderTextField}
                inputRef={prevCredRef}
                type={showPrevPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setPrevShowPassword(!showPrevPassword)}
                      >
                        {showPrevPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <h3 className={styles.subHeader}>New {editType}</h3>
              <TextField
                sx={grayBorderTextField}
                inputRef={newCredRef}
                type={showNewPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setNewShowPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
        </div>
        <div className={styles.buttons}>
          <Button
            onClick={() => handleClose()}
            variant="contained"
            sx={{ ...whiteButtonGrayBorder, width: "120px" }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ ...forestGreenButton, width: "120px" }}
            onClick={handleUpdateCredential}
            disabled={loading}
          >
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

export default EditCredentialPopup;

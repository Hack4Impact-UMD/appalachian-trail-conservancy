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

  const updateEmail = () => {
    // TODO
  };

  const updatePassword = () => {
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
    if (prevCred !== "" && newCred !== "") {
      if (admin) {
        if (editType === "Email") updateEmail();
        else updatePassword();
      }
    } else {
      setLoading(false);
      setCanClose(true);
      setSnackbarMessage("Please fill out all fields");
      setSnackbar(true);
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
        <p className={styles.title}>
          {editType === "Email" && "Confirm"} Edit {editType}
        </p>
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
              <TextField sx={grayBorderTextField} inputRef={newCredRef} />

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

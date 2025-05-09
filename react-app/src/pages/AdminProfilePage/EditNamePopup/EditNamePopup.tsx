import { useState, useRef } from "react";
import styles from "./EditNamePopup.module.css";
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

const EditNamePopup = ({
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

  const nameRef = useRef();

  const handleUpdateName = () => {
    if (admin) {
      setCanClose(false);
      setLoading(true);

      //@ts-ignore
      const newName = nameRef.current?.value.trim();

      if (newName !== "") {
        let newAdmin = admin;

        if (editType === "First") {
          newAdmin = { ...admin, firstName: newName };
        } else {
          newAdmin = { ...admin, lastName: newName };
        }

        updateAdmin(newAdmin, auth.id)
          .then(() => {
            setAdmin(newAdmin);
            auth.setUser(newAdmin); // Update user in AuthProvider
            auth.setFirstName(newAdmin.firstName);
            auth.setLastName(newAdmin.lastName);
            setSnackbarMessage(`${editType} name updated successfully`);
          })
          .catch((e) => {
            console.error(e);
            setSnackbarMessage(`Error updating ${editType.toLowerCase()} name`);
          })
          .finally(() => {
            setLoading(false);
            setCanClose(true);
            setSnackbar(true);
            onClose();
          });
      } else {
        setSnackbarMessage(`${editType} name cannot be empty`);
        setLoading(false);
        setCanClose(true);
        setSnackbar(true);
      }
    }
  };

  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  return (
    <Modal
      height={260}
      open={open}
      onClose={() => {
        handleClose();
      }}>
      <div className={styles.content}>
        <p className={styles.title}>Edit {editType} Name</p>
        <div className={styles.textFields}>
          <h3 className={styles.subHeader}>New {editType} Name</h3>
          <TextField
            sx={grayBorderTextField}
            className={styles.inputTextField}
            defaultValue={
              editType === "First" ? admin?.firstName : admin?.lastName
            }
            inputRef={nameRef}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            onClick={() => onClose()}
            variant="contained"
            sx={{ ...whiteButtonGrayBorder, width: "120px" }}
            disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ ...forestGreenButton, width: "120px" }}
            onClick={handleUpdateName}
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

export default EditNamePopup;

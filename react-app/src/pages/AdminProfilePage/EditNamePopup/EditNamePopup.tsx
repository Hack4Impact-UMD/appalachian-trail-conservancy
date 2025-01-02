import { useState, useRef } from "react";
import styles from "./EditNamePopup.module.css";
import Modal from "../../../components/ModalWrapper/Modal";
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

  const nameRef = useRef();

  const handleUpdateName = () => {
    if (admin) {
      //@ts-ignore
      if (nameRef.current?.value !== "") {
        let newAdmin = admin;
        //@ts-ignore
        const newName = nameRef.current?.value;
        if (editType === "First") {
          newAdmin = { ...admin, firstName: newName };
        } else {
          newAdmin = { ...admin, lastName: newName };
        }

        updateAdmin(newAdmin, auth.id)
          .then(() => {
            setAdmin(newAdmin);
            setSnackbarMessage(`${editType} name updated successfully`);
          })
          .catch((e) => {
            console.error(e);
            setSnackbarMessage(`Error updating ${editType.toLowerCase()} name`);
          })
          .finally(() => {
            setSnackbar(true);
            onClose();
          });
      } else {
        setSnackbarMessage(`${editType} name cannot be empty`);
        setSnackbar(true);
      }
    }
  };

  return (
    <Modal
      height={260}
      width={450}
      open={open}
      onClose={() => {
        onClose();
      }}
    >
      <div className={styles.content}>
        <p className={styles.title}>Edit {editType} Name</p>
        <div className={styles.textFields}>
          <h3 className={styles.subHeader}>New {editType} Name</h3>
          <TextField
            sx={grayBorderTextField}
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
            sx={whiteButtonGrayBorder}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={forestGreenButton}
            onClick={handleUpdateName}
          >
            Confirm
          </Button>
        </div>
      </div>
      <div className={styles.closeButton}>
        <IoCloseOutline onClick={() => onClose()} />
      </div>
    </Modal>
  );
};

export default EditNamePopup;

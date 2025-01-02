import { useState } from "react";
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

  const [newName, setNewName] = useState<string>(
    (editType === "First" ? admin?.firstName : admin?.lastName) || ""
  );

  const handleUpdateName = () => {
    if (admin) {
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
            setSnackbarMessage(`${editType} name updated successfully`);
          })
          .catch((e) => {
            console.error(e);
            setSnackbarMessage(`Error updating ${editType.toLowerCase()} name`);
          })
          .finally(() => {
            setNewName("");
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
      height={275}
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
            onChange={(e) => {
              setNewName(e.target.value);
            }}
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

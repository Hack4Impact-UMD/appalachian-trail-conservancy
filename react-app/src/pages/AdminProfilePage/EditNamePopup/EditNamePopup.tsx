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
            setLoading(false);
            setCanClose(true);
            setSnackbar(true);
            onClose();
          });
      } else {
        setLoading(false);
        setCanClose(true);
        setSnackbarMessage(`${editType} name cannot be empty`);
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
      width={450}
      open={open}
      onClose={() => {
        handleClose();
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
            sx={{ ...whiteButtonGrayBorder, width: "120px" }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ ...forestGreenButton, width: "120px" }}
            onClick={handleUpdateName}
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

export default EditNamePopup;

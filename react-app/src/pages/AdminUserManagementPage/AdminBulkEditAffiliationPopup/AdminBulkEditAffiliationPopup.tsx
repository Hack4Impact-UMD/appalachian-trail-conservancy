import { useEffect, useState } from "react";
import styles from "./AdminBulkEditAffiliationPopup.module.css";
import Modal from "../../../components/ModalWrapper/Modal.tsx";
import Loading from "../../../components/LoadingScreen/Loading.tsx";
import { Autocomplete, Button, TextField } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import {
  whiteButtonGrayBorder,
  forestGreenButton,
  autocompleteText,
  whiteSelectGrayBorder,
  autocompleteOptionStyle,
} from "../../../muiTheme.ts";
import { updateBulkVolunteerAffiliation } from "../../../backend/AdminFirestoreCalls.ts";
import { getAffiliationList } from "../../../backend/FirestoreCalls.ts";
import { AffiliationList } from "../../../types/AssetsType.ts";

interface modalPropsType {
  open: boolean;
  onClose: () => void;
  volunteerIds: string[];
  onSuccess: () => void;
  setOpenSnackbar: (value: boolean) => void;
  setSnackbarMessage: (value: string) => void;
  setSnackbarSeverity: (value: "success" | "warning" | "error") => void;
}

const AdminBulkEditAffiliationPopup = ({
  open,
  onClose,
  volunteerIds,
  onSuccess,
  setOpenSnackbar,
  setSnackbarMessage,
  setSnackbarSeverity,
}: modalPropsType): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [canClose, setCanClose] = useState<boolean>(true);
  const [affiliation, setAffiliation] = useState<string | null>(null);
  const [affiliationOptions, setAffiliationOptions] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setAffiliation(null);
    }
  }, [open]);

  // Fetch affiliation list
  useEffect(() => {
    if (!open) {
      return;
    }

    setLoading(true);
    getAffiliationList()
      .then((affiliationList: AffiliationList) => {
        setAffiliationOptions(affiliationList.affiliations);
      })
      .catch(() => {
        setSnackbarMessage(
          "Error retrieving affiliation list. Please try again later."
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open]);

  const handleUpdateAffiliation = () => {
    if (volunteerIds.length > 0) {
      if (affiliation && affiliation.trim() !== "") {
        setCanClose(false);
        setLoading(true);

        const trimmedAffiliation = affiliation.trim();

        updateBulkVolunteerAffiliation(trimmedAffiliation, volunteerIds)
          .then((result) => {
            onSuccess();
            setAffiliation(trimmedAffiliation);
            setSnackbarMessage(result.message);
            setSnackbarSeverity(
              result.failedIds.length > 0 ? "error" : "success"
            );
            onClose();
          })
          .catch((error) => {
            setSnackbarMessage(
              error instanceof Error
                ? error.message
                : "Error updating affiliations"
            );
            setSnackbarSeverity("error");
          })
          .finally(() => {
            setLoading(false);
            setCanClose(true);
            setOpenSnackbar(true);
          });
      } else {
        setSnackbarMessage(`Affiliation cannot be empty`);
        setSnackbarSeverity("error");
        setLoading(false);
        setCanClose(true);
        setOpenSnackbar(true);
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
        <p className={styles.title}>Edit Affiliation</p>
        <div className={styles.textFields}>
          <h3 className={styles.subHeader}>New Affiliation</h3>
          <Autocomplete
            sx={{
              ...whiteSelectGrayBorder,
              width: "350",
              display: "flex",
              alignItems: "center",
              border: "2px solid var(--blue-gray)",
              borderRadius: "10px",
            }}
            className={styles.inputTextField}
            slotProps={{
              // style options
              paper: {
                sx: { ...autocompleteOptionStyle },
              },
            }}
            disablePortal
            value={affiliation}
            options={affiliationOptions}
            onChange={(event, selected) => {
              setAffiliation(selected);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                InputLabelProps={{
                  shrink: false,
                }}
                sx={autocompleteText}
              />
            )}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{ ...whiteButtonGrayBorder, width: "120px" }}
            disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ ...forestGreenButton, width: "120px" }}
            onClick={handleUpdateAffiliation}
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

export default AdminBulkEditAffiliationPopup;

import { useEffect, useState } from "react";
import styles from "./AdminEditAffiliationPopup.module.css";
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
import { VolunteerID } from "../../../types/UserType.ts";
import { updateVolunteerAffiliation } from "../../../backend/AdminFirestoreCalls.ts";
import { getAffiliationList } from "../../../backend/FirestoreCalls.ts";
import { AffiliationList } from "../../../types/AssetsType.ts";

interface modalPropsType {
  open: boolean;
  onClose: any;
  volunteer: VolunteerID;
  setVolunteer: any;
  setSnackbar: any;
  setSnackbarMessage: any;
}

const AdminEditAffiliationPopup = ({
  open,
  onClose,
  volunteer,
  setVolunteer,
  setSnackbar,
  setSnackbarMessage,
}: modalPropsType): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [canClose, setCanClose] = useState<boolean>(true);
  const [affiliation, setAffiliation] = useState<string | null>(
    volunteer?.affiliation ?? null
  );
  const [affiliationOptions, setAffiliationOptions] = useState<string[]>([]);

  // Fetch affiliation list
  useEffect(() => {
    getAffiliationList()
      .then((affiliationList: AffiliationList) => {
        setAffiliationOptions(affiliationList.affiliations);
      })
      .catch((e) => {
        console.error("Failed to fetch affiliation list:", e);
        setSnackbarMessage(
          "Error retrieving affiliation list. Please try again later."
        );
        setSnackbar(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (open) {
      setAffiliation(volunteer?.affiliation ?? null);
    }
  }, [open, volunteer?.affiliation]);

  const handleUpdateAffiliation = () => {
    if (volunteer) {
      setCanClose(false);
      setLoading(true);

      if (affiliation && affiliation.trim() !== "") {
        const trimmedAffiliation = affiliation.trim();
        const newVolunteer = { ...volunteer, affiliation: trimmedAffiliation };

        updateVolunteerAffiliation(trimmedAffiliation, volunteer.id)
          .then(() => {
            setVolunteer(newVolunteer);
            setAffiliation(trimmedAffiliation);
            setSnackbarMessage(`Affiliation updated successfully`);
          })
          .catch(() => {
            setSnackbarMessage(`Error updating affiliation`);
          })
          .finally(() => {
            setLoading(false);
            setCanClose(true);
            setSnackbar(true);
            onClose();
          });
      } else {
        setSnackbarMessage(`Affiliation cannot be empty`);
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
            onClick={() => onClose()}
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

export default AdminEditAffiliationPopup;

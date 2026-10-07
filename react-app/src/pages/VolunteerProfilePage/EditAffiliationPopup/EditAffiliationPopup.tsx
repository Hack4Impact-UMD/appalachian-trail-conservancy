import { useEffect, useState } from "react";
import styles from "./EditAffiliationPopup.module.css";
import Modal from "../../../components/ModalWrapper/Modal";
import Loading from "../../../components/LoadingScreen/Loading";
import { useAuth } from "../../../auth/AuthProvider";
import { Autocomplete, Button, TextField } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import {
  whiteButtonGrayBorder,
  forestGreenButton,
  autocompleteText,
  whiteSelectGrayBorder,
  autocompleteOptionStyle,
} from "../../../muiTheme";
import { Volunteer } from "../../../types/UserType";
import { updateVolunteer } from "../../../backend/VolunteerFirestoreCalls";
import { getAffiliationList } from "../../../backend/FirestoreCalls.ts";
import { AffiliationList } from "../../../types/AssetsType.ts";

interface modalPropsType {
  open: boolean;
  onClose: any;
  volunteer: Volunteer | undefined;
  setVolunteer: any;
  setSnackbar: any;
  setSnackbarMessage: any;
}

const EditAffiliationPopup = ({
  open,
  onClose,
  volunteer,
  setVolunteer,
  setSnackbar,
  setSnackbarMessage,
}: modalPropsType): React.ReactElement => {
  const auth = useAuth();

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

  const handleUpdateName = () => {
    if (volunteer) {
      setCanClose(false);
      setLoading(true);

      if (affiliation && affiliation.trim() !== "") {
        setAffiliation(affiliation.trim());
        const newVolunteer = { ...volunteer, affiliation: affiliation };

        updateVolunteer(newVolunteer, auth.id)
          .then(() => {
            setVolunteer(newVolunteer);
            auth.setUser(newVolunteer); // Update user in AuthProvider
            setSnackbarMessage(`Affiliation updated successfully`);
          })
          .catch((e) => {
            console.error(e);
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

export default EditAffiliationPopup;

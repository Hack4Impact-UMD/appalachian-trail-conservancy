import styles from "./AdminDeleteTrainingDraftPopup.module.css";
import { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { whiteButtonGrayBorder, hazardRedButton } from "../../../muiTheme";
import { useNavigate } from "react-router";
import Modal from "../../../components/ModalWrapper/Modal";
import Loading from "../../../components/LoadingScreen/Loading";
import { getTraining, deleteTraining } from "../../../backend/FirestoreCalls";

interface modalPropsType {
  open: boolean;
  onClose: any;
  trainingId: string | undefined;
}

const AdminDeleteTrainingDraftPopup = ({
  open,
  onClose,
  trainingId,
}: modalPropsType): React.ReactElement => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [canClose, setCanClose] = useState<boolean>(true); // can close modal state
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const deleteDraft = async () => {
    try {
      setCanClose(false);
      setLoading(true);

      if (!trainingId) {
        // unsaved draft; navigate to training library
        navigate("/trainings", {
          state: { fromDelete: true, showSnackbar: true }, //use state to pass that it should show snackbar
        });
      } else {
        // ensure training is draft before deleting
        const training = await getTraining(trainingId);
        if (training.status !== "DRAFT") {
          setLoading(false);
          setCanClose(true);
          setSnackbarMessage("Training cannot be deleted.");
          setSnackbar(true);
        } else {
          await deleteTraining(trainingId);
          setLoading(false);
          setCanClose(true);
          navigate("/trainings", {
            state: { fromDelete: true, showSnackbar: true }, //use state to pass that it should show snackbar
          });
        }
      }
    } catch (error) {
      setLoading(false);
      setCanClose(true);
      setSnackbarMessage("Error deleting draft. Please try again.");
      setSnackbar(true);
    }
  };

  return (
    <>
      <Modal
        height={250}
        width={450}
        open={open}
        onClose={() => {
          if (canClose) {
            onClose();
          }
        }}>
        <div className={styles.content}>
          <p className={styles.title}>
            ARE YOU SURE YOU WANT TO DELETE THIS DRAFT?
          </p>
          <p className={styles.text}>This action cannot be undone.</p>
          <div className={styles.buttons}>
            <div className={styles.leftButton}>
              <Button
                onClick={() => onClose()}
                variant="contained"
                disabled={loading}
                sx={{
                  ...whiteButtonGrayBorder,
                  width: "100px",
                }}>
                CANCEL
              </Button>
            </div>
            <div className={styles.rightButton}>
              <Button
                onClick={() => deleteDraft()}
                variant="contained"
                disabled={loading}
                sx={{
                  ...hazardRedButton,
                  width: "100px",
                }}>
                {loading ? <Loading /> : "YES"}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.closeButton}>
          <IoCloseOutline
            onClick={() => {
              if (canClose) {
                onClose();
              }
            }}
          />
        </div>
      </Modal>
      <Snackbar
        open={snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position within the right section
      >
        <Alert onClose={() => setSnackbar(false)} severity={"error"}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminDeleteTrainingDraftPopup;

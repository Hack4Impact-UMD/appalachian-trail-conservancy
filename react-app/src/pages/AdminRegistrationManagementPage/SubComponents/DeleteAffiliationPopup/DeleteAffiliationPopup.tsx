import styles from "./DeleteAffiliationPopup.module.css";
import { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { whiteButtonGrayBorder, hazardRedButton } from "../../../../muiTheme";
import Modal from "../../../../components/ModalWrapper/Modal";
import Loading from "../../../../components/LoadingScreen/Loading";

interface modalPropsType {
  open: boolean;
  onClose: () => void;
  affiliation: string;
  onDelete: () => Promise<void>;
}

const DeleteAffiliationPopup = ({
  open,
  onClose,
  affiliation,
  onDelete,
}: modalPropsType): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [canClose, setCanClose] = useState<boolean>(true); // can close modal state
  const [snackbar, setSnackbar] = useState(false);

  const deleteAffiliation = () => {
    setCanClose(false);
    setLoading(true);

    onDelete()
      .then(() => {
        setLoading(false);
        setCanClose(true);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setCanClose(true);
        setSnackbar(true);
      });
  };

  return (
    <>
      <Modal
        height={270}
        open={open}
        onClose={() => {
          if (canClose) {
            onClose();
          }
        }}>
        <div className={styles.content}>
          <p className={styles.title}>DELETE AFFILIATION?</p>
          <div className={styles.textContainer}>
            <span className={styles.text}>
              <strong>{affiliation}</strong>
            </span>
            <span className={styles.text}>This action cannot be undone.</span>
          </div>
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
                onClick={() => deleteAffiliation()}
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
              onClose();
            }}
          />
        </div>
      </Modal>
      <Snackbar
        open={snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={() => setSnackbar(false)} severity={"error"}>
          Error deleting volunteer. Please try again.
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeleteAffiliationPopup;

import { useState } from "react";
import styles from "./LinkSharePopup.module.css";
import Modal from "../../components/ModalWrapper/Modal";
import { Alert, Button, Snackbar, TextField } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import {
  whiteButtonGrayBorder,
  forestGreenButton,
  grayBorderTextField,
} from "../../muiTheme";

interface modalPropsType {
  open: boolean;
  onClose: any;
  shareLink: string;
}

const LinkSharePopup = ({
  open,
  onClose,
  shareLink,
}: modalPropsType): React.ReactElement => {
  const [snackbar, setSnackbar] = useState(false);
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setSnackbar(true);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  };

  return (
    <>
      <Modal
        height={250}
        open={open}
        onClose={() => {
          onClose();
        }}>
        <div className={styles.content}>
          <p className={styles.title}>Share Link</p>
          <div className={styles.textFields}>
            <TextField
              sx={grayBorderTextField}
              className={styles.inputTextField}
              value={shareLink}
              InputProps={{
                readOnly: true,
              }}
              inputProps={{
                onClick: (event: React.MouseEvent<HTMLInputElement>) => {
                  event.currentTarget.select();
                },
              }}
            />
          </div>
          <div className={styles.buttons}>
            <Button
              onClick={() => onClose()}
              variant="contained"
              sx={{ ...whiteButtonGrayBorder, width: "120px" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ ...forestGreenButton, width: "120px" }}
              onClick={handleCopyLink}>
              Copy
            </Button>
          </div>
        </div>
        <div className={styles.closeButton}>
          <IoCloseOutline onClick={() => onClose()} />
        </div>
      </Modal>

      {/* Snackbar wrapper container */}
      <div className={styles.snackbarContainer}>
        <Snackbar
          open={snackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <Alert onClose={handleCloseSnackbar} severity={"success"}>
            Link copied to clipboard!
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default LinkSharePopup;

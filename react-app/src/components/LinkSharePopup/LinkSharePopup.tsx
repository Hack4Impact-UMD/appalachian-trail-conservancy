import { useState } from "react";
import styles from "./LinkSharePopup.module.css";
import Modal from "../../components/ModalWrapper/Modal";
import { Alert, Snackbar, IconButton, TextField, Tooltip } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";
import { grayBorderTextField } from "../../muiTheme";

interface modalPropsType {
  open: boolean;
  onClose: any;
  title?: string;
  shareLink: string;
}

const LinkSharePopup = ({
  open,
  onClose,
  title = "Share Link",
  shareLink,
}: modalPropsType): React.ReactElement => {
  const [snackbar, setSnackbar] = useState(false);
  const [copied, setCopied] = useState<boolean>(false);
  const handleCopy = () => {
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        setCopied(true);
      })
      .catch((err) => {
        setSnackbar(true);
        console.error("Copy failed:", err);
      });

    // Reset tooltip text after a delay
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  };

  return (
    <>
      <Modal
        height={200}
        open={open}
        onClose={() => {
          onClose();
        }}>
        <div className={styles.content}>
          <p className={styles.title}>{title}</p>
          <div className={styles.textFields}>
            <TextField
              value={shareLink}
              sx={{
                ...grayBorderTextField,
              }}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Tooltip title={copied ? "Copied!" : "Copy"}>
                    <IconButton
                      onClick={handleCopy}
                      sx={{ color: "var(--blue-gray)" }}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                ),
              }}
              inputProps={{
                onClick: (event: React.MouseEvent<HTMLInputElement>) => {
                  event.currentTarget.select();
                },
              }}
            />
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
          <Alert onClose={handleCloseSnackbar} severity={"error"}>
            Failed copy code to clipboard
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default LinkSharePopup;

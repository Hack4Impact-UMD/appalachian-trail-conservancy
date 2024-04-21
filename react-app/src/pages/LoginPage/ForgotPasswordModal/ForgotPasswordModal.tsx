import { useState } from "react";
import { OutlinedInput, Button } from "@mui/material";
import { forestGreenButton, grayBorderTextField } from "../../../muiTheme";
import { IoCloseOutline } from "react-icons/io5";
import { sendResetEmail } from "../../../backend/AuthFunctions";
import styles from "./ForgotPasswordModal.module.css";
import Modal from "../../../components/ModalWrapper/Modal";
import greenCheck from "../../../assets/greenCircleCheck.svg";

const styledRectButton = {
  width: 350,
  marginTop: "5%",
};

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<String>("");

  const handleSendReset = async () => {
    const pattern: RegExp = /^\S+@\S+$/;

    if (!pattern.test(email)) {
      setErrorMessage("*Not a valid email");
    } else {
      sendResetEmail(email)
        .then(() => {
          setSuccess(true);
        })
        .catch(() => {
          setErrorMessage("Failed to send email.");
        });
    }
  };

  const handleOnClose = (): void => {
    onClose();
    setSuccess(false);
    setEmail("");
    setErrorMessage("");
  };

  return (
    <div>
      <Modal open={open} onClose={onClose} height={350} width={550}>
        {/* x button to close */}
        <IoCloseOutline
          color="var(--blue-gray)"
          className={styles.closeButton}
          onClick={() => handleOnClose()}
        />
        {success ? (
          <div className={styles.content}>
            <img src={greenCheck} alt="Green Check" height="75" />
            <h2 className={styles.subheader}>Reset Password Link Sent</h2>
            <div className={`${styles.emailText} ${styles.centered}`}>
              <p>Please check your email</p>
            </div>
          </div>
        ) : (
          <div className={styles.content}>
            <h2>Reset Password</h2>

            <form>
              {/* email field */}
              <div className={styles.alignLeft}>
                <h3 className={styles.label}>Email</h3>
              </div>
              <OutlinedInput
                value={email}
                sx={grayBorderTextField}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />

              <Button
                sx={{ ...styledRectButton, ...forestGreenButton }}
                variant="contained"
                onClick={() => handleSendReset()}
              >
                Send Reset Email
              </Button>
            </form>
            <p className={styles.errorMessage}>{errorMessage}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ForgotPasswordModal;

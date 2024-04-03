import { useState } from "react";
import Modal from "../../../components/ModalWrapper/Modal";
import { TextField, Button } from "@mui/material";
import { forestGreenButton, styledInputBoxes } from "../../../muiTheme";
import styles from "./ForgotPasswordModal.module.css";
import { IoMdClose } from "react-icons/io";

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

  return (
    <div>
      <Modal open={open} onClose={onClose} height={350} width={550}>
        {/* x button to close */}
        <IoMdClose
          color="var(--blue-gray)"
          className={styles.closeButton}
          onClick={onClose}
        />

        <div className={styles.content}>
          <h2>Reset Password</h2>

          <form>
            {/* email field */}
            <div className={styles.alignLeft}>
              <h3 className={styles.label}>Email</h3>
            </div>
            <TextField
              value={email}
              sx={styledInputBoxes}
              label=""
              variant="outlined"
              size="small"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />

            <Button
              type="submit"
              sx={{ ...styledRectButton, ...forestGreenButton }}
              variant="contained">
              Reset Password
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ForgotPasswordModal;

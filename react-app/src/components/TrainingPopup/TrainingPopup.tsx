import styles from "./TrainingPopup.module.css";
import { Button } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { styledButtonWhiteBlack } from "../../muiTheme";

interface modalPropsType {
  open: boolean;
  onClose: any;
  height: number;
  width: number;
  image: string;
}

const TrainingPopup = ({
  open,
  onClose,
  image,
}: modalPropsType): React.ReactElement => {
  return (
    <div
      className={styles.modalContainer}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {open ? (
        <>
          <div className={styles.background} onClick={() => onClose()} />
          <div className={styles.centered}>
            <div className={styles.modal}>
              <div className={styles.left}>
                <h2>Training Title</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <Button variant="contained" sx={styledButtonWhiteBlack}>
                  Learn More
                </Button>
              </div>
              <div className={styles.right}>
                <div className={styles.closeButton}>
                  <IoCloseOutline onClick={() => onClose()} />
                </div>
                <div className={styles.image}>
                  <img src={image} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

TrainingPopup.defaultProps = {
  width: 400,
};

export default TrainingPopup;

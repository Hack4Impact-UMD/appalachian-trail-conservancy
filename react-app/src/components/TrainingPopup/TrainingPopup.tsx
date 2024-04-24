import styles from "./TrainingPopup.module.css";
import { Button } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { whiteButtonGrayBorder } from "../../muiTheme";
import { useNavigate } from "react-router-dom";

interface modalPropsType {
  open: boolean;
  onClose: any;
  title: string;
  image: string;
}

const TrainingPopup = ({
  open,
  onClose,
  title,
  image,
}: modalPropsType): React.ReactElement => {
  const navigate = useNavigate();
  return (
    <div
      className={styles.modalContainer}
      onClick={(e) => {
        e.stopPropagation();
      }}>
      {open ? (
        <>
          <div className={styles.background} onClick={() => onClose()} />
          <div className={styles.centered}>
            <div className={styles.modal}>
              <div className={styles.left}>
                <p className={styles.title}>{title}</p>
                <p className={styles.textContainer}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <div className={styles.learnMoreButton}>
                  {/* TODO: Navigate to training landing page and pass Training and VolunteerTraining as state */}
                  <Button
                    variant="contained"
                    sx={{ ...whiteButtonGrayBorder, width: "150px" }}
                    onClick={() =>
                      navigate("/trainings/resources/0", {
                        state: { fromApp: true },
                      })
                    }>
                    Learn More
                  </Button>
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.closeButton}>
                  <IoCloseOutline onClick={() => onClose()} />
                </div>
                <img src={image} />
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

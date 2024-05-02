import styles from "./TrainingPopup.module.css";
import { Button } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { whiteButtonGrayBorder } from "../../muiTheme";
import { useNavigate } from "react-router-dom";
import { Training, TrainingID } from "../../types/TrainingType";
import { VolunteerTraining } from "../../types/UserType";

interface modalPropsType {
  open: boolean;
  onClose: any;
  training: TrainingID;
  volunteerTraining: VolunteerTraining | undefined;
}

const TrainingPopup = ({
  open,
  onClose,
  training,
  volunteerTraining,
}: modalPropsType): React.ReactElement => {
  const navigate = useNavigate();
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
                <p className={styles.title}>{training.name}</p>
                <p className={styles.textContainer}>{training.shortBlurb}</p>
                <div className={styles.learnMoreButton}>
                  {/* TODO: Navigate to training landing page and pass Training and VolunteerTraining as state */}
                  <Button
                    variant="contained"
                    sx={{ ...whiteButtonGrayBorder, width: "150px" }}
                    onClick={() =>
                      navigate(`/trainings/:${training.id}`, {
                        state: {
                          training: training,
                          volunteerTraining: volunteerTraining,
                        },
                      })
                    }
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.closeButton}>
                  <IoCloseOutline onClick={() => onClose()} />
                </div>
                <img src={training.coverImage} />
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

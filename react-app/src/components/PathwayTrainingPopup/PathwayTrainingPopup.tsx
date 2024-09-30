import styles from "./PathwayTrainingPopup.module.css";
import { Button } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import { whiteButtonGrayBorder } from "../../muiTheme";
import { useNavigate } from "react-router-dom";
import { TrainingID } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType";
import { VolunteerTraining, VolunteerPathway } from "../../types/UserType";

interface modalPropsType {
  open: boolean;
  onClose: any;
  record: TrainingID | PathwayID;
  volunteerRecord?: VolunteerTraining | VolunteerPathway;
  mode: "training" | "pathway";
}

const PathwayTrainingPopup = ({
  open,
  onClose,
  record,
  volunteerRecord,
  mode,
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
                <p className={styles.title}>{record.name}</p>
                <p className={styles.textContainer}>{record.shortBlurb}</p>
                <div className={styles.learnMoreButton}>
                  <Button
                    variant="contained"
                    sx={{ ...whiteButtonGrayBorder, width: "150px" }}
                    onClick={() =>
                      navigate(
                        mode === "training"
                          ? `/trainings/${record.id}`
                          : `/pathways/${record.id}`,
                        {
                          state: {
                            training: record,
                            volunteerTraining: volunteerRecord,
                          },
                        }
                      )
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
                <img src={record.coverImage} />
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

PathwayTrainingPopup.defaultProps = {
  width: 400,
};

export default PathwayTrainingPopup;

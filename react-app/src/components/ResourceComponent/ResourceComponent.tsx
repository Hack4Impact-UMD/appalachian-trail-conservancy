import { Button } from "@mui/material";
import { whiteButtonGrayBorder } from "../../muiTheme";
import { TrainingResource } from "../../types/TrainingType";
import styles from "./ResourceComponent.module.css";

interface ResourceProps {
  resource: TrainingResource;
  handleContinueButton: Function;
  handleBackButton: Function;
}

const ResourceComponent: React.FC<ResourceProps> = ({
  resource,
  handleContinueButton,
  handleBackButton,
}) => {
  return (
    <div className={styles.mainContainer}>
      {/* Video iframe */}
      <div className={styles.iframeContainer}>
        <iframe
          title="Video Player"
          src={resource.link}
          allowFullScreen></iframe>
      </div>

      <div className={styles.contentLabel}>
        {/* Video title */}
        <h2>{resource.title}</h2>

        {/* Buttons */}
        <div className={styles.buttonContainer}>
          <Button
            sx={whiteButtonGrayBorder}
            onClick={() => handleBackButton()}
            variant="contained">
            Back
          </Button>
          <Button
            sx={whiteButtonGrayBorder}
            onClick={() => handleContinueButton()}
            variant="contained">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourceComponent;

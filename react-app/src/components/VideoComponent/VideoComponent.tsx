import Button from "@mui/material/Button";
import styles from "./VideoComponent.module.css";
import { styledButtonWhiteBlack } from "../../muiTheme";

interface VideoProps {
  url: string;
  title: string;
}

const VideoComponent: React.FC<VideoProps> = ({ url, title }) => {
  return (
    <div>
      {/* Video iframe */}
      <div className={styles.iframeContainer}>
        <iframe
          className={styles.iframeStyle}
          title="Video Player"
          src={url}
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>

      <div className={styles.contentLabel}>
        {/* Video title */}
        <h2>{title}</h2>

        {/* Buttons */}
        <div className={styles.buttonContainer}>
          <Button sx={styledButtonWhiteBlack}>Back</Button>
          <Button sx={styledButtonWhiteBlack}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default VideoComponent;

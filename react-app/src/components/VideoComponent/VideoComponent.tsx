
import Button from "@mui/material/Button";
import styles from "./VideoComponent.module.css";

interface VideoProps {
    url: string;
    title: string;
  }
  
  const buttonStyle = {
    color: "black",
    padding: "4%",
    borderRadius: "0px",
    margin: "3%",
    border: "1px solid black"
  };

  const VideoComponent: React.FC<VideoProps> = ({ url, title }) => {
    return (
      <div>
        {/* Video iframe */}
        <div className={styles.iframeContainer}>
          <iframe className={styles.iframeStyle}
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
          <div className={styles.buttonsContainer}>
            <Button sx={buttonStyle} variant="text"> Back </Button>
            <Button sx={buttonStyle} variant="text"> Continue </Button>
          </div>
        </div>
      </div>
    );
  };
  
  export default VideoComponent;
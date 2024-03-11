
import Button from "@mui/material/Button";
import styles from "./VideoComponent.module.css";

interface VideoProps {
    url: string;
    title: string;
  }
  
  const buttonStyle = {
    color: "black",
    borderRadius: "0px",
    padding: "15%",
    width: "250%",
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
              <div><Button sx={buttonStyle} variant="text"> Back </Button></div>
              <div><Button sx={buttonStyle} variant="text"> Continue </Button></div>
            </div>
        </div>
      </div>
    );
  };
  
  export default VideoComponent;

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
        <iframe
          title="Video Player"
          width="560"
          height="315"
          src={url}
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
  
        <div className={styles.contentLabel}>
            {/* Video title */}
            <h2>{title}</h2>
    
            {/* Buttons */}
            <div>
            <Button sx={buttonStyle} variant="text"> Back </Button>
            <Button sx={buttonStyle} variant="text"> Continue </Button>
            </div>
        </div>
      </div>
    );
  };
  
  export default VideoComponent;
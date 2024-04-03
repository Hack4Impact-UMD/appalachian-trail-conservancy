import Button from "@mui/material/Button";
import styles from "./PDFComponent.module.css";
import { styledButtonWhiteBlack } from "../../muiTheme";

interface PDFProps {
  url: string;
  title: string;
}

const PDFComponent: React.FC<PDFProps> = ({ url, title }) => {
  return (
    <div>
      <div className={styles.iframeContainer}>
        <iframe
          className={styles.iframeStyle}
          title="PDF Viewer"
          src={url}
          height="400"
          allowFullScreen
        ></iframe>
      </div>

      <div className={styles.contentLabel}>
        {/* Video title */}
        <h2>{title}</h2>

        {/* Buttons */}
        <div className={styles.buttonsContainer}>
          <Button sx={styledButtonWhiteBlack}>Back</Button>
          <Button sx={styledButtonWhiteBlack}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default PDFComponent;

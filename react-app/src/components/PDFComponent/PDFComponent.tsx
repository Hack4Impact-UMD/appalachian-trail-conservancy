
import Button from "@mui/material/Button";
import styles from "./PDFComponent.module.css";

interface PDFProps {
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

  const PDFComponent: React.FC<PDFProps> = ({ url, title }) => {
    return (
      <div>
            <iframe
            title="PDF Viewer"
            src={url}
            width="800"
            height="600"
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
  
  export default PDFComponent;
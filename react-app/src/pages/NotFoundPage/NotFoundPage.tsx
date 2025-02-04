import { forestGreenButton } from "../../muiTheme";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";
import primaryLogo from "../../assets/atc-primary-logo.png";

const buttonStyle = {
  ...forestGreenButton,
  width: 350,
  marginTop: "5%",
  padding: "1%",
  fontSize: "1.125rem",
};

function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={primaryLogo} className={styles.logoImg} alt="ATC Logo" />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist</p>
        <Link to="/">
          <Button sx={buttonStyle} variant="contained">
            back to dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;

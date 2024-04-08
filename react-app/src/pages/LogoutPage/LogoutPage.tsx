import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { forestGreenButton } from "../../muiTheme";
import logo from "../../assets/atc-primary-logo.png";
import greenCheck from "../../assets/greenCircleCheck.svg";
import styles from "./LogoutPage.module.css";

const buttonStyle = {
  ...forestGreenButton,
  width: 350,
  marginTop: "5%",
  padding: "1%",
  fontSize: "1.125rem",
};

const LogoutPage: React.FC = () => {
  return (
    <div className={styles.centeredContainer}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <img src={greenCheck} alt="Green Check" className={styles.checkmark} />
      <h1 className={styles.logoutText}>You have been logged out</h1>

      <Link to="/login">
        <Button sx={buttonStyle} variant="contained">
          Sign in Again
        </Button>
      </Link>
    </div>
  );
};

export default LogoutPage;

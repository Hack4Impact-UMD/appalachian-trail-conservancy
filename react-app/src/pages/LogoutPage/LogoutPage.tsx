import { Link, useLocation, Navigate } from "react-router-dom";
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
  const location = useLocation();

  if (!location.state?.fromApp) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.centeredContainer}>
      <img src={logo} className={styles.logo} alt="Logo" />
      <img src={greenCheck} className={styles.checkmark} alt="Green Check" />
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

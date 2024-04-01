import { Link } from "react-router-dom";
import styles from "./LoginPage.module.css";
import primaryLogo from "../../assets/atc-primary-logo.png";
import { styledButtonGreen, styledButtonWhiteGreen } from "../../muiTheme";
import { Button } from "@mui/material";
import loginBanner from "../../assets/login-banner.jpeg";

const styledRectButton = {
  height: 40,
  width: 350,
  marginTop: "5%",
  padding: "1%",
};

function LoginPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.split}>
        <div className={styles.left}>
          <img src={loginBanner} alt="Login Image" />
        </div>
        <div className={styles.right}>
          <div className={styles.centered}>
            <div className={styles.rightImgContainer}>
              <img src={primaryLogo} alt="ATC Logo" />
            </div>
            {/* welcome label */}
            <h1 className={styles.heading}>Welcome!</h1>
            <Link to="/login/user">
              <Button
                sx={{ ...styledRectButton, ...styledButtonGreen }}
                variant="contained">
                Sign in as volunteer
              </Button>
            </Link>
            <Link to="/login/admin">
              <Button
                sx={{ ...styledRectButton, ...styledButtonWhiteGreen }}
                variant="contained"
                href="#contained-buttons">
                Sign in as admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

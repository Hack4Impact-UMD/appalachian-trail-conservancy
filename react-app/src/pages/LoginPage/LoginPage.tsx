import { useAuth } from "../../auth/AuthProvider";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@mui/material";
import { forestGreenButton, whiteButtonGreenBorder } from "../../muiTheme";
import styles from "./LoginPage.module.css";
import primaryLogo from "../../assets/atc-primary-logo.png";
import loginBanner from "../../assets/login-banner.jpeg";

const styledRectButton = {
  width: 350,
  marginTop: "5%",
};

function LoginPage() {
  const { user } = useAuth();
  // If user is logged in, navigate to Dashboard
  if (user) {
    return <Navigate to="/" />;
  }

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
            <Link to="/login/volunteer">
              <Button
                sx={{ ...styledRectButton, ...forestGreenButton }}
                variant="contained"
              >
                Sign in as volunteer
              </Button>
            </Link>
            <Link to="/login/admin">
              <Button
                sx={{ ...styledRectButton, ...whiteButtonGreenBorder }}
                variant="contained"
                href="#contained-buttons"
              >
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

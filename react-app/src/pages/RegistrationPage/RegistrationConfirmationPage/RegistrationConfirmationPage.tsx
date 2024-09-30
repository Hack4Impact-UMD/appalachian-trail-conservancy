import {
  Button,
} from "@mui/material";
import greenCheck from "../../../assets/greenCircleCheck.svg";
import { forestGreenButton, grayBorderTextField } from "../../../muiTheme.ts";
import { styledRectButton } from "../../LoginPage/LoginPage.tsx";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider.tsx";
import styles from "./RegistrationConfirmationPage.module.css";
import loginBanner from "../../../assets/login-banner.jpeg";

function RegistrationConfirmationPage() {
  const { user } = useAuth();
  // If user is logged in, navigate to Dashboard (?)
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.pageContainer}>
        <div className={styles.top}>
          <img src={loginBanner} className={styles.loginBanner} alt="Login Image" />
        </div>
          <div className={styles.centered}>

              <div className={styles.contentContainer}><h1 className={styles.heading}>Thanks for registering!</h1></div>
              <div className={styles.contentContainer}><img src={greenCheck} className={styles.checkmark} alt="Green Check" /></div>
              <div className={styles.contentContainer}><p>Please check your email for confirmation.</p></div>

              {/* continue button */}
              <div className={`${styles.centered} ${styles.contentContainer}`}>
              <Link to="/login/volunteer/">
                <Button
                  type="submit"
                  sx={{ ...styledRectButton, ...forestGreenButton }}
                  variant="contained"
                >
                 Continue to login
                </Button>
              </Link>
              </div>
              
            {/* go back */}
            <div><Link to="/registration/" className={`${styles.switch} ${styles.contentContainer}`}>
              Go back
            </Link>
            </div>
          </div>
        </div>

  );
}

export default RegistrationConfirmationPage;

import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { forestGreenButton } from "../../muiTheme";
import { Button } from "@mui/material";
import styles from "./RequireVolunteerAuth.module.css";
import Loading from "../../components/LoadingScreen/Loading";
import primaryLogo from "../../assets/atc-primary-logo.png";
import LogoutPopup from "../../components/LogoutPopup/LogoutPopup";

interface Props {
  children: JSX.Element;
}

const buttonStyle = {
  ...forestGreenButton,
  width: 350,
  marginTop: "5%",
  padding: "1%",
  fontSize: "1.125rem",
};

const RequireAdminAuth: React.FC<Props> = ({ children }) => {
  const authContext = useAuth();
  const [openLogoutPopup, setOpenLogoutPopup] = useState<boolean>(false);
  if (authContext.loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  } else if (!authContext.user) {
    return <Navigate to="/login" state={{ redir: window.location.pathname }} />;
  } else if (authContext.token?.claims?.role != "VOLUNTEER") {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.content}>
          <img src={primaryLogo} className={styles.logoImg} alt="ATC Logo" />
          <h2>Permission Denied</h2>
          <p>You do not have permission to access this page</p>
          <div className={styles.buttonContainer}>
            <Link to="/">
              <Button sx={buttonStyle} variant="contained">
                back to dashboard
              </Button>
            </Link>
            <Button
              sx={buttonStyle}
              variant="contained"
              onClick={() => {
                setOpenLogoutPopup(true);
              }}>
              Log Out
            </Button>
          </div>
        </div>
        <LogoutPopup open={openLogoutPopup} onClose={setOpenLogoutPopup} />
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdminAuth;

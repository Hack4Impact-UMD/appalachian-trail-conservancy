import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { forestGreenButton, grayBorderTextField } from "../../../muiTheme";
import { useNavigate } from "react-router";
import { Link, Navigate } from "react-router-dom";
import { authenticateUserEmailLink } from "../../../backend/AuthFunctions";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { useAuth } from "../../../auth/AuthProvider";
import styles from "./VolunteerLoginPage.module.css";
import Loading from "../../../components/LoadingScreen/Loading";
import primaryLogo from "../../../assets/atc-primary-logo.png";
import loginBanner from "../../../assets/login-banner.jpeg";
import app from "../../../config/firebase";
import greenCheck from "../../../assets/greenCircleCheck.svg";

const styledRectButton = {
  width: 350,
  marginTop: "5%",
};

function VolunteerLoginPage(history: any) {
  const navigate = useNavigate();

  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [failureMessage, setFailureMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [viewElements, setViewElements] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>("");

  const handleSendLink = async (event: any) => {
    event.preventDefault();

    const pattern: RegExp = /^\S+@\S+$/;

    if (!pattern.test(email)) {
      setFailureMessage("*Not a valid email");
    } else {
      setDisplayText(email);
      setViewElements(true);
      setFailureMessage("");
      handleLogin();
    }
  };

  const handleLogin = async () => {
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };

    try {
      const auth = getAuth(app);
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // add error handling if email does not exist
      window.localStorage.setItem("emailForSignIn", email);
    } catch (error) {
      alert(error);
    }
  };

  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  const beforeEmail = (
    <div>
      <form
        className={styles.centered}
        onSubmit={(event) => {
          handleSendLink(event);
        }}>
        {/* email field */}
        <div className={styles.alignLeft}>
          <h3 className={styles.label}>Email</h3>
        </div>
        <TextField
          value={email}
          sx={{ ...grayBorderTextField, marginBottom: "15px" }}
          label=""
          variant="outlined"
          size="small"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        {/* send link button */}
        <Button
          type="submit"
          sx={{ ...styledRectButton, ...forestGreenButton }}
          variant="contained"
          onClick={(e) => handleSendLink(e)}>
          {showLoading ? <Loading></Loading> : "Send Link"}
        </Button>

        {/* error message */}
        <p
          className={
            failureMessage ? styles.showFailureMessage : styles.errorContainer
          }>
          {failureMessage}
        </p>
      </form>
    </div>
  );

  const sentEmail = (
    <div className={styles.centered}>
      <img src={greenCheck} alt="Green Check" height="75" />
      <h2 className={styles.subheader}>Check your email!</h2>
      <div className={`${styles.emailText} ${styles.centered}`}>
        <p>
          The login link has been sent to&nbsp;
          <span className={styles.greenText}>{displayText}</span>.
        </p>
        <p>Please use the link to access your dashboard.</p>
      </div>
    </div>
  );

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
            <h1 className={styles.heading}>Welcome!</h1>

            {/* display check message if valid email is submitted */}
            {viewElements ? sentEmail : beforeEmail}

            {/* switch to admin link */}
            <Link to="/login/admin">
              <button className={styles.switch}>Switch to Admin Log In</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VolunteerLoginPage;

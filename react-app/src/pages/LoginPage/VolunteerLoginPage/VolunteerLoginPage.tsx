import { useState, useEffect } from "react";
import { OutlinedInput, Button } from "@mui/material";
import {
  forestGreenButton,
  grayBorderTextField,
  styledRectButton,
} from "../../../muiTheme";
import { Link, Navigate } from "react-router-dom";
import { sendSignInLink } from "../../../backend/AuthFunctions";
import { useAuth } from "../../../auth/AuthProvider";
import Loading from "../../../components/LoadingScreen/Loading";
import styles from "./VolunteerLoginPage.module.css";
import primaryLogo from "../../../assets/atc-primary-logo.png";
import loginBanner from "../../../assets/login-banner.jpeg";
import greenCheck from "../../../assets/greenCircleCheck.svg";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { getAuth } from "firebase/auth";
import app from "../../../config/firebase";

function VolunteerLoginPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [failureMessage, setFailureMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [viewConfirmation, setViewConfirmation] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>("");
  const [showLoading, setShowLoading] = useState<boolean>(false);

  useEffect(() => {
    const auth = getAuth(app);
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (email === null) {
        email = prompt("Please provide your email.");
      }

      signInWithEmailLink(auth, email ?? "", window.location.href)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
        })
        .catch(() => {});
    } else {
      setLoading(false);
    }
  }, []);

  // If user is logged in, navigate to Dashboard
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSendLink = async (event: any) => {
    event.preventDefault();
    const pattern: RegExp = /^[^@]+@[^@]+\.[^@]+$/;

    if (!pattern.test(email)) {
      setFailureMessage("*Not a valid email");
    } else {
      setShowLoading(true);
      sendSignInLink(email)
        .then(() => {
          setDisplayText(email);
          setViewConfirmation(true);
          setFailureMessage("");
        })
        .catch((e) => {
          console.error(e);
          setFailureMessage("Failed to send email.");
        })
        .finally(() => {
          setShowLoading(false);
        });
    }
  };

  const beforeEmail = (
    <div>
      <form
        className={styles.centered}
        onSubmit={(event) => {
          handleSendLink(event);
        }}
      >
        {/* email field */}
        <div className={styles.alignLeft}>
          <h3 className={styles.label}>Email</h3>
        </div>
        <OutlinedInput
          value={email}
          sx={{ ...grayBorderTextField, marginBottom: "15px" }}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        {/* send link button */}
        <Button
          type="submit"
          sx={{ ...styledRectButton, ...forestGreenButton }}
          variant="contained"
          onClick={(e) => {
            handleSendLink(e);
          }}
          disabled={showLoading}
        >
          {showLoading ? <Loading color="white" /> : "Send Link"}
        </Button>

        {/* error message */}
        <p
          className={
            failureMessage ? styles.showFailureMessage : styles.errorContainer
          }
        >
          {failureMessage}
        </p>
        {/* switch to admin link */}
        <Link to="/login/admin" className={styles.switch}>
          Switch to Admin Log In
        </Link>
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
            {loading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : (
              <>
                <h1 className={styles.heading}>Welcome!</h1>

                {/* display check message if valid email is submitted */}
                {viewConfirmation ? sentEmail : beforeEmail}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VolunteerLoginPage;

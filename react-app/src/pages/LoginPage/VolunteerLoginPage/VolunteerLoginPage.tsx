import { useState } from "react";
import { OutlinedInput, Button } from "@mui/material";
import { forestGreenButton, grayBorderTextField } from "../../../muiTheme";
import { styledRectButton } from "../LoginPage";
import { Link, Navigate } from "react-router-dom";
import { sendSignInLink } from "../../../backend/AuthFunctions";
import { useAuth } from "../../../auth/AuthProvider";
import styles from "./VolunteerLoginPage.module.css";
import primaryLogo from "../../../assets/atc-primary-logo.png";
import loginBanner from "../../../assets/login-banner.jpeg";
import greenCheck from "../../../assets/greenCircleCheck.svg";

function VolunteerLoginPage() {
  const { user } = useAuth();
  // If user is logged in, navigate to Dashboard
  if (user) {
    return <Navigate to="/" />;
  }

  const [failureMessage, setFailureMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [viewConfirmation, setViewConfirmation] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>("");

  const handleSendLink = async (event: any) => {
    event.preventDefault();

    const pattern: RegExp = /^[^@]+@[^@]+\.[^@]+$/;

    if (!pattern.test(email)) {
      setFailureMessage("*Not a valid email");
    } else {
      sendSignInLink(email)
        .then(() => {
          setDisplayText(email);
          setViewConfirmation(true);
          setFailureMessage("");
        })
        .catch(() => {
          setFailureMessage("Failed to send email.");
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
          onClick={(e) => handleSendLink(e)}
        >
          Send Link
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
            <h1 className={styles.heading}>Welcome!</h1>

            {/* display check message if valid email is submitted */}
            {viewConfirmation ? sentEmail : beforeEmail}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VolunteerLoginPage;

import { useState } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { authenticateUser } from "../../../backend/AuthFunctions";
import { AuthError } from "firebase/auth";
import Loading from "../../../components/LoadingScreen/Loading";
import styles from "./VolunteerLoginPage.module.css";
import primaryLogo from "../../../assets/atc-primary-logo.png";
import { forestGreenButton, grayBorderTextField } from "../../../muiTheme";
import loginBanner from "../../../assets/login-banner.jpeg";
import greenCheck from "../../../assets/greenCircleCheck.svg";

const styledRectButton = {
  width: 350,
  marginTop: "5%",
};

function VolunteerLoginPage() {
  const navigate = useNavigate();

  const [showLoading, setShowLoading] = useState<boolean>(false);
  //Add Error Handling
  const [failureMessage, setFailureMessage] = useState<string>("");

  const [email, setEmail] = useState<string>("");

  const [viewElements, setViewElements] = useState<boolean>(false);

  const [displayText, setDisplayText] = useState<string>("");

  const beforeEmail = (
    <div>
      <form
        onSubmit={(event) => {
          handleSendLink(event);
        }}
      >
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
          onClick={(e) => handleSendLink(e)}
        >
          {showLoading ? <Loading></Loading> : "Send Link"}
        </Button>

        {/* error message */}
        <p
          className={
            failureMessage ? styles.showFailureMessage : styles.errorContainer
          }
        >
          {failureMessage}
        </p>
      </form>{" "}
    </div>
  );

  const sentEmail = (
    <div className={styles.centered}>
      <div className={styles.greenCheck}>
        <img src={greenCheck} alt="Green Check" />
      </div>
      <h3>Check your email!</h3>
      <div className={styles.emailText}>
        <p>
          {" "}
          The login link has been sent to{" "}
          <span className={styles.greenText}>{displayText}</span>.
        </p>
        <p> Please use the link to access the dashboard. </p>
      </div>
    </div>
  );

  const handleSendLink = async (event: any) => {
    event.preventDefault();

    const pattern: RegExp = /^\S+@\S+$/;

    if (!pattern.test(email)) {
      setFailureMessage("*Not a valid email");
    } else {
      setDisplayText(email);
      setViewElements(true);
      setFailureMessage("");
    }
  };

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

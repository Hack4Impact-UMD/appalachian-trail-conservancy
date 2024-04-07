import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { forestGreenButton, grayBorderTextField } from "../../../muiTheme";
import Loading from "../../../components/LoadingScreen/Loading";
import styles from "./VolunteerLoginPage.module.css";
import primaryLogo from "../../../assets/atc-primary-logo.png";
import loginBanner from "../../../assets/login-banner.jpeg";

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

  const handleSendLink = async (event: any) => {
    event.preventDefault();

    const pattern: RegExp = /^\S+@\S+$/;

    if (!pattern.test(email)) {
      setFailureMessage("*Not a valid email");
    } else {
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

            {/* welcome label */}
            <h1 className={styles.heading}>Welcome!</h1>

            <form
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
                  failureMessage
                    ? styles.showFailureMessage
                    : styles.errorContainer
                }>
                {failureMessage}
              </p>
            </form>

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

import { useState, useEffect } from "react";
import {
  FormControl,
  Button,
  OutlinedInput,
  FormHelperText,
  Tooltip,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  forestGreenButton,
  grayBorderTextField,
  styledRectButton,
  whiteTooltip,
} from "../../../muiTheme.ts";
import { Navigate } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider.tsx";
import { createVolunteerUser } from "../../../backend/AuthFunctions.ts";
import styles from "./RegistrationPage.module.css";
import Loading from "../../../components/LoadingScreen/Loading.tsx";
import primaryLogo from "../../../assets/atc-primary-logo.png";
import { trim } from "lodash";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function RegistrationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showLoading, setShowLoading] = useState<boolean>(false);

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [emailsMatch, setEmailsMatch] = useState<boolean>(true);
  const [invalidEmailMessage, setInvalidEmailMessage] = useState<string>("");

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [joinCode, setJoinCode] = useState<string>("");

  // If user is logged in, navigate to Dashboard
  if (user) {
    return <Navigate to="/" />;
  }

  // Check if email is valid
  const validateEmail = (email: string) => {
    const pattern = /^[^@]+@[^@]+\.[^@]+$/;
    return pattern.test(email);
  };

  useEffect(() => {
    if (email !== "" && confirmEmail !== "") {
      const match =
        trim(email).toLowerCase() === trim(confirmEmail).toLowerCase();

      if (!match) {
        setInvalidEmailMessage("Emails don't match");
        setInvalidEmail(true);
      }
      setEmailsMatch(match);
    }
  }, [email, confirmEmail]);

  const handleConfirm = (event: any) => {
    event.preventDefault();
    setShowLoading(true);

    // Confirm button validates that inputs arent empty

    // Check if email is valid
    if (!validateEmail(email)) {
      setInvalidEmailMessage("Invalid email");
      setInvalidEmail(true);
      setEmailsMatch(false);
    } else {
      createVolunteerUser(email, firstName, lastName, joinCode)
        .then(() => {
          navigate("/registration-confirmation", {
            state: { fromApp: true },
          });
        })
        .catch(() => {
          setSnackbarMessage(
            "Error creating account. Account may already exist or join code may be incorrect."
          );
          setSnackbar(true);
        });
    }
    setShowLoading(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.centered}>
        {/* logo image */}
        <div className={styles.top}>
          <img src={primaryLogo} className={styles.logo} alt="ATC Logo" />
        </div>

        {/* form input */}
        {/* welcome header */}
        <h1 className={styles.heading}>
          Welcome!
          <br />
          <span className={styles.welcomeSubtext}>New users register here</span>
        </h1>
        <form onSubmit={handleConfirm}>
          <FormControl>
            {/* first name field */}
            <div className={styles.alignLeft}>
              <h3 className={styles.label}>First Name</h3>
            </div>
            <OutlinedInput
              value={firstName}
              sx={grayBorderTextField}
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />

            {/* last name field */}
            <div className={styles.alignLeft}>
              <h3 className={styles.label}>Last Name</h3>
            </div>
            <TextField
              value={lastName}
              sx={grayBorderTextField}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />

            {/* email field */}
            <div className={`${styles.alignLeft} ${styles.emailContainer}`}>
              <h3 className={styles.emailLabelContainer}>Email</h3>
              <Tooltip
                title="Please use your email used in the Volunteer Engagement Platform"
                placement="right"
                componentsProps={{
                  tooltip: {
                    sx: { ...whiteTooltip },
                  },
                }}>
                <InfoOutlinedIcon />
              </Tooltip>
            </div>
            <TextField
              sx={{
                ...grayBorderTextField,
                border: !emailsMatch
                  ? "2px solid #d32f2f"
                  : "2px solid var(--blue-gray)",
              }}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              error={invalidEmail}
            />

            {/* confirm email field */}
            <div className={`${styles.alignLeft} ${styles.emailContainer}`}>
              <h3 className={styles.emailLabelContainer}>Confirm Email</h3>
            </div>
            <TextField
              sx={{
                ...grayBorderTextField,
                border: !emailsMatch
                  ? "2px solid #d32f2f"
                  : "2px solid var(--blue-gray)",
              }}
              value={confirmEmail}
              onChange={(e) => {
                setConfirmEmail(e.target.value);
              }}
              error={invalidEmail}
            />
            <div className={styles.invalidEmailMessage}>
              {!emailsMatch && (
                <FormHelperText sx={{ margin: "0" }} error>
                  {invalidEmailMessage}
                </FormHelperText>
              )}
            </div>

            {/* join code field */}
            <div className={`${styles.alignLeft} ${styles.joinCodeContainer}`}>
              <h3 className={styles.joinCodeLabel}>Join Code</h3>
              <Tooltip
                title="Paste the join code that was provided in the Volunteer Engagement Platform"
                placement="right"
                componentsProps={{
                  tooltip: {
                    sx: { ...whiteTooltip },
                  },
                }}>
                <InfoOutlinedIcon />
              </Tooltip>
            </div>
            <TextField
              sx={grayBorderTextField}
              value={joinCode}
              onChange={(event) => {
                setJoinCode(event.target.value);
              }}
            />
          </FormControl>

          {/* submit button */}
          <div className={styles.confirmButton}>
            <Button
              type="submit"
              sx={{ ...styledRectButton, ...forestGreenButton }}
              variant="contained"
              onClick={(e) => handleConfirm(e)}
              disabled={
                !(
                  firstName !== "" &&
                  lastName !== "" &&
                  email !== "" &&
                  confirmEmail !== "" &&
                  email === confirmEmail &&
                  joinCode !== ""
                )
              }>
              {showLoading ? <Loading color="white" /> : "Confirm"}
            </Button>
          </div>
        </form>

        <Snackbar
          open={snackbar}
          autoHideDuration={6000}
          onClose={() => setSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position within the right section
        >
          <Alert onClose={() => setSnackbar(false)} severity={"error"}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* switch to sign in */}
        <Link to="/login/" className={styles.switch}>
          Already have an account? Log in here!
        </Link>
      </div>
    </div>
  );
}

export default RegistrationPage;

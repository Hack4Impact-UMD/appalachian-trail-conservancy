import { useState, useEffect } from "react";
import {
  FormControl,
  Button,
  OutlinedInput,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import {
  forestGreenButton,
  grayBorderTextField,
  styledRectButton,
} from "../../../muiTheme.ts";
import { Navigate } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider.tsx";
import { createVolunteerUser } from "../../../backend/AuthFunctions.ts";
import styles from "./RegistrationPage.module.css";
import Loading from "../../../components/LoadingScreen/Loading.tsx";
import primaryLogo from "../../../assets/atc-primary-logo.png";
import { trim } from "lodash";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function RegistrationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showLoading, setShowLoading] = useState<boolean>(false);

  //Add Error Handling
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  

  const [email, setEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [joinCode, setJoinCode] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [emailsMatch, setEmailsMatch] = useState<boolean>(false);

  // If user is logged in, navigate to Dashboard (?)
  if (user) {
    return <Navigate to="/" />;
  }

  // Check if email is valid
  const validateEmail = (email: string) => {
    const pattern = /^[^@]+@[^@]+\.[^@]+$/;
    return pattern.test(email);
  };

  useEffect(() => {
    let match = true;
    if (email.length > 0 && confirmEmail.length > 0)  
      match = trim(email).toLowerCase() === trim(confirmEmail).toLowerCase();
  
    
    setEmailsMatch(match);
    setIsFormValid(match);
  }, [email, confirmEmail]);

  const handleConfirm = async (event: any) => {
    event.preventDefault();
    setShowLoading(true);

    if (!validateEmail(email)) {
      setInvalidEmail(true);
    } else {
      await createVolunteerUser(email, firstName, lastName, joinCode)
        .then(() => {
          navigate("/registration-confirmation", {
            state: { fromApp: true },
          });
        })
        .catch(() => {
          setErrorMessage(
            "Error creating account. Account may already exist or join code may be incorrect."
          );
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
            <OutlinedInput
              value={lastName}
              sx={grayBorderTextField}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />

            {/* email field */}
            <div className={`${styles.alignLeft} ${styles.emailContainer}`}>
              <h3 className={styles.label}>Email</h3>
              <Tooltip
                      title="Please use your ATC volunteer email"
                      placement="right"
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "white",
                            color: "black",
                          },
                        },
                      }}
                    >
                      <InfoOutlinedIcon />
                    </Tooltip>
            </div>
            <OutlinedInput
              sx={{
                width: 350,
                fontSize: "1.1rem",
                height: 48,
                borderRadius: "10px",
                border: invalidEmail
                  ? "2px solid #d32f2f"
                  : "2px solid var(--blue-gray)",
                "& fieldset": {
                  border: "none",
                },
                "& input::placeholder": {
                  color: "black",
                },
              }}
              value={email}
              // placeholder="Use your ATC Volunteer email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              error={invalidEmail}
            />
            {invalidEmail && (
              <FormHelperText error>Invalid email</FormHelperText>
            )}
            {/* Confirm email box */}
            <div>
            <div className={`${styles.alignLeft} ${styles.emailContainer}`}>
              <h3 className={styles.label}>Confirm Email</h3>
            </div>
            <OutlinedInput
              sx={{
                width: 350,
                fontSize: "1.1rem",
                height: 48,
                borderRadius: "10px",
                border: !emailsMatch
                  ? "2px solid #d32f2f"
                  : "2px solid var(--blue-gray)",
                "& fieldset": {
                  border: "none",
                },
                "& input::placeholder": {
                  color: "black",
                },
              }}
              value={confirmEmail}
              // placeholder="Use your ATC Volunteer email"
              onChange={(e) => {
                setConfirmEmail(e.target.value);
              }}
              error={invalidEmail}
            />
            {!emailsMatch && (
              <FormHelperText error>Emails don't match</FormHelperText>
            )}
            </div>
            {/* join code field */}
            <div className={styles.alignLeft}>
              <h3 className={styles.label}>Join Code</h3>
            </div>
            <OutlinedInput
              sx={{
                width: 350,
                fontSize: "1.1rem",
                height: 48,
                borderRadius: "10px",
                border: "2px solid var(--blue-gray)",
                "& fieldset": {
                  border: "none",
                },
              }}
              onChange={(event) => {
                setJoinCode(event.target.value);
              }}
            />
          </FormControl>

          {/* submit button */}
          <div className={`${styles.alignLeft} ${styles.button}`}>
            <Button
              type="submit"
              sx={{ ...styledRectButton, ...forestGreenButton }}
              variant="contained"
              onClick={(e) => handleConfirm(e)}
              disabled={!isFormValid}
            >
              {showLoading ? <Loading color="white" /> : "Confirm"}
            </Button>
          </div>
        </form>

        <div className={styles.error}>{errorMessage}</div>

        {/* switch to sign in */}
        <Link to="/login/" className={styles.switch}>
          Already have an account? Log in here!
        </Link>
      </div>
    </div>
  );
}

export default RegistrationPage;

import { useState } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Button,
  Tooltip,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { forestGreenButton, grayBorderTextField } from "../../../muiTheme.ts";
import { styledRectButton } from "../../LoginPage/LoginPage.tsx";
import { Navigate } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider.tsx";
import { authenticateUserEmailAndPassword } from "../../../backend/AuthFunctions.ts";
import { AuthError } from "firebase/auth";
import styles from "./RegistrationPage.module.css";
import Loading from "../../../components/LoadingScreen/Loading.tsx";
import primaryLogo from "../../assets/atc-primary-logo.png";
import loginBanner from "../../../assets/login-banner.jpeg";
import { IoIosInformationCircleOutline } from "react-icons/io";

function RegistrationPage() {
  const { user } = useAuth();
  // If user is logged in, navigate to Dashboard
  if (user) {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();

  //Add Forgot Password Popup
  const [openForgotModal, setOpenForgotModal] = useState<boolean>(false);
  const handleOpenForgotModal = () => {
    setOpenForgotModal(true);
  };
  const handleCloseForgotModal = () => {
    setOpenForgotModal(false);
  };
  const [showLoading, setShowLoading] = useState<boolean>(false);
  //Add Error Handling
  const [failureMessage, setFailureMessage] = useState<string>("");
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [invalidCode, setInvalidCode] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [joinCode, setJoinCode] = useState<string>("");

  const isFormValid = firstName && lastName && email && joinCode;

  const validateEmail = (email: string) => {
    const pattern = /^\S+@\S+$/;
    return pattern.test(email);
  };

  const handleConfirm = async (event: any) => {
    event.preventDefault();
    setShowLoading(true);

    if (!validateEmail(email)) {
      setInvalidEmail(true);
    } else {
      setShowLoading(false);
      navigate("/registration-confirmation");
    }
    setShowLoading(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.top}>
        <img
          src={loginBanner}
          className={styles.loginBanner}
          alt="Login Image"
        />
      </div>
      <div className={styles.centered}>
        {/* welcome header */}
        <h1 className={styles.heading}>Welcome! New users register here.</h1>
        <form onSubmit={handleConfirm}>
          {/* first name field */}
          <div className={styles.alignLeft}>
            <h3 className={styles.label}>First Name</h3>
          </div>
          <TextField
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
            <h3 className={styles.label}>Email</h3>
            <Tooltip
              title="Use your ATC volunteer email here."
              arrow
              placement="right"
            >
              <span className={styles.icon}>
                <IoIosInformationCircleOutline />
              </span>
            </Tooltip>
          </div>
          <TextField
            variant="outlined"
            sx={{
              ...grayBorderTextField,
              "&.hover": {
                backgroundColor: "red", 
              },
            }}
            error={invalidEmail} 
            helperText={invalidEmail ? "Invalid email" : ""}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          {/* join code field */}
          <div className={styles.alignLeft}>
            <h3 className={styles.label}>Join Code</h3>
          </div>
            <TextField
              sx={grayBorderTextField}
              onChange={(event) => {
                setJoinCode(event.target.value);
              }}
            />

          {/* submit button */}
          <div className={`${styles.alignLeft} ${styles.button}`}>
            <Button
              type="submit"
              sx={{ ...styledRectButton, ...forestGreenButton }}
              variant="contained"
              onClick={(e) => handleConfirm(e)}
              disabled={!isFormValid}
            >
              {showLoading ? <Loading></Loading> : "Confirm"}
            </Button>
          </div>

          {/* error message */}
          <p
            className={
              failureMessage ? styles.showFailureMessage : styles.errorContainer
            }
          >
            {failureMessage}
          </p>
        </form>

        {/* switch to sign in */}
        <Link to="/login/" className={styles.switch}>
          Already have an account? Sign in here!
        </Link>
      </div>
    </div>
  );
}

export default RegistrationPage;

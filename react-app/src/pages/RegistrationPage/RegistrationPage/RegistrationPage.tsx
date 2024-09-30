import { useState } from "react";
import {
  FormControl,
  Button,
  Tooltip,
  TextField,
} from "@mui/material";

import { forestGreenButton, grayBorderTextField } from "../../../muiTheme.ts";
import { styledRectButton } from "../../LoginPage/LoginPage.tsx";
import { Navigate } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider.tsx";
import styles from "./RegistrationPage.module.css";
import Loading from "../../../components/LoadingScreen/Loading.tsx";
import loginBanner from "../../../assets/login-banner.jpeg";
import { IoIosInformationCircleOutline } from "react-icons/io";

function RegistrationPage() {
  const { user } = useAuth();
  // If user is logged in, navigate to Dashboard (?)
  if (user) {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();

  const [showLoading, setShowLoading] = useState<boolean>(false);

  //Add Error Handling
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [invalidCode, setInvalidCode] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [joinCode, setJoinCode] = useState<string>("");

  const isFormValid = firstName && lastName && email && joinCode;

  //Check if email is valid
  const validateEmail = (email: string) => {
    const pattern = /^\S+@\S+$/;
    return pattern.test(email);
  };

  //Handle confirm button click
  const handleConfirm = async (event: any) => {
    event.preventDefault();
    setShowLoading(true);

    if (!validateEmail(email)) {
      setInvalidEmail(true);
    } else {
      setShowLoading(false);
      navigate("/registration-confirmation"); /* proceed to confirmation */
    }
    setShowLoading(false);
  };

  return (
    <div className={styles.pageContainer}>

       {/* banner image */}
      <div className={styles.top}>
        <img
          src={loginBanner}
          className={styles.loginBanner}
          alt="Login Image"
        />
      </div>

       {/* form input */}
      <div className={styles.centered}>

        {/* welcome header */}
        <h1 className={styles.heading}>Welcome! New users register here.</h1>
        <form onSubmit={handleConfirm}>

        <FormControl>
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
              arrow={false}
              placement="right"  
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'white',
                    color: 'black', 
                    borderRadius: '8px', 
                    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
                  },
                },
              }}         >
              <span className={styles.icon}>
                <IoIosInformationCircleOutline />
              </span>
            </Tooltip>
          </div>
          <TextField
            variant="outlined"
            sx={{
              width: 350,
              fontSize: '1.1rem',
              height: 48,
              borderRadius: '10px',
              border: invalidEmail ? '2px solid #d32f2f' : '2px solid var(--blue-gray)',
              '& fieldset': {
                border: 'none',
              },
            }}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            error={invalidEmail} 
            helperText={invalidEmail ? "Invalid email" : ""}
            FormHelperTextProps={{ style: { marginTop: '-0.25rem' }}}
          />

          {/* join code field */}
          <div className={styles.alignLeft}>
            <h3 className={styles.label}>Join Code</h3>
          </div>
            <TextField
               sx={{
                width: 350,
                fontSize: '1.1rem',
                height: 48,
                borderRadius: '10px',
                border: invalidCode ? '2px solid #d32f2f' : '2px solid var(--blue-gray)',
                '& fieldset': {
                  border: 'none',
                },
              }}
              onChange={(event) => {
                setJoinCode(event.target.value);
              }}
              error={invalidCode} 
              helperText={invalidCode ? "Invalid code" : ""}
              FormHelperTextProps={{ style: { marginTop: '-0.25rem' }}}
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
              {showLoading ? <Loading></Loading> : "Confirm"}
            </Button>
          </div>
        </form>

        {/* switch to sign in */}
        <Link to="/login/" className={styles.switch}>
          Already have an account? Log in here!
        </Link>
      </div>
    </div>
  );
}

export default RegistrationPage;

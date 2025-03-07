import { useState } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  forestGreenButton,
  grayBorderTextField,
  styledRectButton,
} from "../../../muiTheme";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider";
import { authenticateUserEmailAndPassword } from "../../../backend/AuthFunctions";
import { AuthError } from "firebase/auth";
import styles from "./AdminLoginPage.module.css";
import Loading from "../../../components/LoadingScreen/Loading";
import primaryLogo from "../../../assets/atc-primary-logo.png";
import loginBanner from "../../../assets/login-banner.jpeg";
import ForgotPasswordModal from "../ForgotPasswordModal/ForgotPasswordModal";

function AdminLoginPage() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // If user is logged in, navigate to Dashboard
  if (user) {
    return <Navigate to="/" />;
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSignIn = async (event: any) => {
    event.preventDefault();
    setShowLoading(true);

    if (email && password) {
      const pattern: RegExp = /^\S+@\S+$/;
      if (!pattern.test(email)) {
        setShowLoading(false);
        setFailureMessage("*Not a valid email");
      } else {
        authenticateUserEmailAndPassword(email, password)
          .then(() => {
            setShowLoading(false);
            <Navigate to="/" />;
          })
          .catch((error) => {
            setShowLoading(false);
            const code = (error as AuthError).code;
            if (code === "auth/too-many-requests") {
              setFailureMessage(
                "*Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later."
              );
            } else {
              setFailureMessage("*Incorrect email address or password");
            }
          });
      }
    } else {
      setFailureMessage("*Incorrect email address or password");
      setShowLoading(false);
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
            {/* admin label */}
            <h1 className={styles.heading}>Admin</h1>

            <form
              onSubmit={(event) => {
                if (!openForgotModal) {
                  handleSignIn(event);
                }
              }}>
              {/* email field */}
              <div className={styles.alignLeft}>
                <h3 className={styles.label}>Email</h3>
              </div>
              <OutlinedInput
                value={email}
                sx={grayBorderTextField}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />

              {/* password field */}
              <div className={styles.alignLeft}>
                <h3 className={styles.label}>Password</h3>
              </div>
              <FormControl>
                <OutlinedInput
                  value={password}
                  sx={grayBorderTextField}
                  type={showPassword ? "text" : "password"}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>

              {/* forgot password button */}
              <div className={styles.alignLeft}>
                <Button
                  sx={{
                    color: "var(--forest-green)",
                    padding: "0px",
                    margin: "8px 0px 8px 0px",
                  }}
                  variant="text"
                  onClick={handleOpenForgotModal}>
                  Forgot Password?
                </Button>
              </div>

              {/* sign in button */}
              <Button
                type="submit"
                sx={{ ...styledRectButton, ...forestGreenButton }}
                variant="contained"
                onClick={(e) => handleSignIn(e)}>
                {showLoading ? <Loading color="white" /> : "Sign In"}
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

            {/* switch to volunteer link */}
            <Link to="/login/volunteer" className={styles.switch}>
              Switch to Volunteer Log In
            </Link>
          </div>
        </div>
      </div>
      <ForgotPasswordModal
        open={openForgotModal}
        onClose={handleCloseForgotModal}></ForgotPasswordModal>
    </div>
  );
}

export default AdminLoginPage;

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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { authenticateUser } from "../../../backend/AuthFunctions";
import { AuthError } from "firebase/auth";
import { useNavigate } from "react-router";
import Loading from "../../../components/LoadingScreen/Loading";
import styles from "./VolunteerLoginPage.module.css";
import primaryLogo from "../../../assets/atc-primary-logo.png";
import { styledButtonGreen, styledInputBoxes } from "../../../muiTheme";

const styledRectButton = {
  width: 350,
  marginTop: "5%",
  padding: "1%",
  height: 40,
};

function VolunteerLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  //Add Forgot Password Popup
  const [openForgotModal, setOpenForgotModal] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  //Add Error Handling
  const [failureMessage, setFailureMessage] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowLoading(true);

    if (email && password) {
      authenticateUser(email, password)
        .then(() => {
          setShowLoading(false);
          navigate("/");
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
    } else {
      setFailureMessage("*Incorrect email address or password");
    }
  };

  return (
    <>
      <div className={`${styles.split} ${styles.left}`}>
        <div className={styles.leftImgContainer}>
          {/* REPLACE IMAGE */}
          <img
            src={
              "https://mediaproxy.salon.com/width/1200/https://media2.salon.com/2019/07/spongebob-20th.jpg"
            }
          />
        </div>
      </div>
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.centered}>
          <div className={styles.login_input}>
            <div className={styles.rightImgContainer}>
              <img src={primaryLogo} />
            </div>
            {/* welcome label */}
            <h1 className={styles.heading}>Welcome!</h1>

            <form
              onSubmit={(event) => {
                if (!openForgotModal) {
                  handleSignIn(event);
                }
              }}
            >
              {/* email field */}
              <div className={styles.alignLeft}>
                <h3 className={styles.label}>Email</h3>
              </div>
              <TextField
                value={email}
                sx={styledInputBoxes}
                label=""
                variant="outlined"
                size="small"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />

              {/* password field */}
              <div className={styles.alignLeft}>
                <h3 className={styles.label}>Password</h3>
              </div>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password"></InputLabel>
                <OutlinedInput
                  value={password}
                  sx={styledInputBoxes}
                  id="outlined-adornment-password"
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
                        edge="end"
                      >
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
                    color: "var(--ocean-green)",
                    padding: "0px",
                    margin: "8px 0px 18px 0px",
                  }}
                  variant="text"
                >
                  Forgot Password?
                </Button>
              </div>
              <p
                className={
                  failureMessage
                    ? styles.showFailureMessage
                    : styles.errorContainer
                }
              >
                {failureMessage}
              </p>
              {/* sign in button */}
              <Button
                type="submit"
                sx={{ ...styledRectButton, ...styledButtonGreen }}
                variant="contained"
              >
                {showLoading ? <Loading></Loading> : "Sign In"}
              </Button>
            </form>

            {/* switch to admin link */}
            <Link to="/login/admin">
              <button className={styles.switch}>Switch to Admin Log In</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default VolunteerLoginPage;

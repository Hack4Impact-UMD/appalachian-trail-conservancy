import * as React from "react";
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
import styles from "./AdminLoginPage.module.css";
import primaryLogo from "../../../assets/atc-primary-logo.png";
import { styledButtonGreen } from "../../../muiTheme";

const styledRectButton = {
  width: 350,
  marginTop: "5%",
  padding: "1%",
};

const styledInputBoxes = {
  border: "1px solid black",
  borderRadius: "0px",
  width: 350,
  height: 40,
  "& fieldset": { border: "none" },
};

function AdminLoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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

            {/* email field */}
            <div className={styles.alignLeft}>
              <h3 className={styles.label}>Email</h3>
            </div>
            <TextField
              sx={styledInputBoxes}
              label=""
              variant="outlined"
              size="small"
            />

            {/* password field */}
            <div className={styles.alignLeft}>
              <h3 className={styles.label}>Password</h3>
            </div>
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password"></InputLabel>
              <OutlinedInput
                sx={styledInputBoxes}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
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
                sx={{ color: "var(--ocean-green)", padding: "0px" }}
                variant="text"
              >
                Forgot Password?
              </Button>
            </div>

            {/* sign in button */}
            <Button
              sx={{ ...styledRectButton, ...styledButtonGreen }}
              variant="contained"
              href="#contained-buttons"
            >
              Sign in
            </Button>

            {/* switch to user link */}
            <button className={styles.switch}>Switch to User Log In</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLoginPage;

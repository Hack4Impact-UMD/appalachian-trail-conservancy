import "./App.css";
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
import styles from "./LoginPage.module.css";

function App() {
  const styledSignInButton = {
    backgroundColor: "#49A772",
    border: "2px solid #49A772",
    borderRadius: "0px",
    boxShadow: "none",
    width: 400,
  };

  const styledInputBoxes = {
    border: "1px solid black",
    borderRadius: "0px",
    width: 400,
    height: 40,
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <div className={styles.row}>
        <div className={styles.right}>
          {/* REPLACE IMAGE */}
          <img
            src={
              "https://i.pinimg.com/736x/e4/dc/e4/e4dce40bc3b75d6c4d68c74763bd7883.jpg"
            }
            height={150}
            width={160}
          />
          {/* welcome label */}
          <h1 className={styles.heading}>Welcome!</h1>

          {/* email field */}
          <p>Email</p>
          <TextField
            sx={styledInputBoxes}
            label=""
            variant="outlined"
            size="small"
          />

          {/* password field */}
          <p>Password</p>
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
          <Button sx={{ color: "#49A772" }} variant="text">
            Forgot Password?
          </Button>

          {/* sign in button */}
          <Button
            sx={styledSignInButton}
            variant="contained"
            href="#contained-buttons"
          >
            Sign in
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;

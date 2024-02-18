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
    backgroundColor: "var(--ocean-green)",
    border: "2px solid var(--ocean-green)",
    borderRadius: "0px",
    boxShadow: "none",
    width: 350,
    marginTop: "5%",
    padding: "2%",
  };

  const styledInputBoxes = {
    border: "1px solid black",
    borderRadius: "0px",
    width: 350,
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
        <div className={styles.imgContainer}>
          {/* REPLACE IMAGE */}
          <img
            src={
              "https://mediaproxy.salon.com/width/1200/https://media2.salon.com/2019/07/spongebob-20th.jpg"
            }
            width={"100%"}
          />
        </div>
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

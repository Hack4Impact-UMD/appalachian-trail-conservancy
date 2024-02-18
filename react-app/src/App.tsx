import "./App.css";
import * as React from 'react';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Button } from "@mui/material";
import {Visibility, VisibilityOff} from '@mui/icons-material';
import styles from './LoginPage.module.css';


function App() {

  const styledSignInButton = {
    backgroundColor: '#49A772',
    border: '2px solid #49A772',
    borderRadius: '0px',
    boxShadow: 'none',
  };
  
  const styledContinueAsGuestButton = {
    backgroundColor: 'white',
      color: '#49A772',
      boxShadow: 'none',
      border: '2px solid #49A772',
      borderRadius: '0px',
  }

  const styledInputBoxes = {
    border: '1px solid black',
    borderRadius: '0px',
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return <>
  <div className={styles.row}>
  <div className={`${styles.column} ${styles.left}`}></div>
  <div className={`${styles.column} ${styles.right}`}>
    {/* welcome label */}
    <h1>Welcome!</h1>

    {/* email field */}
    <p>Email</p>
    <TextField sx={styledInputBoxes} id="outlined-basic" label="" variant="outlined" />

    {/* password field */}
    <p>Password</p>
    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-password"></InputLabel>
      <OutlinedInput
        sx={styledInputBoxes}
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
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
    <Button sx={{ color: '#49A772',}} variant="text">Forgot Password?</Button>

    {/* sign in button */}
    <Button sx={styledSignInButton} variant="contained" href="#contained-buttons">
      Sign in
    </Button>

    {/* continue as guest button */}
    <Button sx={styledContinueAsGuestButton} variant="contained" href="#contained-buttons">
      Continue as guest
    </Button>
    </div>
    </div>
  </>;
}

export default App;

import "./App.css";
import * as React from 'react';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Button } from "@mui/material";
import {Visibility, VisibilityOff} from '@mui/icons-material';

function App() {

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return <>
    {/* welcome label */}
    <h1>Welcome!</h1>

    {/* email field */}
    <TextField id="outlined-basic" label="Email" variant="outlined" />

    {/* password field */}
    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
      <OutlinedInput
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
    <Button variant="text">Forgot Password?</Button>

    {/* sign in button */}
    <Button variant="contained" href="#contained-buttons">
      Sign in
    </Button>

  </>;
}

export default App;

import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface PaletteColor {
    forestGreen?: string;
    skyBlue?: string;
    blueGrey?: string;
  }
}

//Initialized then overridden
let theme = createTheme({
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Oxygen"',
      '"Ubuntu"',
      '"Cantarell"',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      "sans-serif",
    ].join(","),
  },
});

export default theme;

// common styles
const baseStyles = {
  borderRadius: "15px",
  boxShadow: "none",
  height: 44,
};

// forest green button
export const forestGreenButton = {
  ...baseStyles,
  color: "white",
  backgroundColor: "var(--forest-green)",
  border: "2px solid var(--forest-green)",
  "&:hover": {
    backgroundColor: "var(--forest-green)",
    color: "white",
  },
};

// forest green button with padding
export const forestGreenButtonPadding = {
  ...forestGreenButton,
  paddingLeft: "20px",
  paddingRight: "20px",
};

// white with dark green borders (no hover change)
export const whiteButtonGreenBorder = {
  ...baseStyles,
  color: "var(--forest-green)",
  backgroundColor: "white",
  border: "2px solid var(--forest-green)",
  "&:hover": {
    backgroundColor: "white",
    color: "var(--forest-green)",
  },
};

// white w/ blue gray border; ocean green background on hover
export const whiteButtonGrayBorder = {
  ...baseStyles,
  paddingLeft: "20px",
  paddingRight: "20px",
  color: "var(--blue-gray)",
  backgroundColor: "white",
  border: "2px solid var(--blue-gray)",
  "&:hover": {
    color: "white",
    backgroundColor: "var(--ocean-green)",
    border: "2px solid var(--ocean-green)",
  },
};

// white w/ blue gray border for Select Dropdowns
export const whiteSelectGrayBorder = {
  ...baseStyles,
  fontWeight: "500",
  fontSize: "0.875rem",
  color: "var(--blue-gray)",
  backgroundColor: "white",
  border: "2px solid var(--blue-gray)",
  "&:hover": {
    color: "var(--blue-gray)",
    backgroundColor: "white",
    border: "2px solid var(--blue-gray)",
  },
  "& fieldset": { border: "none" },
  ".MuiSvgIcon-root": {
    fill: "var(--blue-gray)",
  },
};

// selectOption
export const selectOptionStyle = {
  height: "44px",
  boxShadow: "none",
  fontWeight: "500",
  fontSize: "0.875rem",
  color: "var(--blue-gray)",
  backgroundColor: "white",
  "&.Mui-selected": {
    backgroundColor: "var(--ocean-green)",
    color: "white",
    "&.Mui-focusVisible": { background: "var(--ocean-green)", color: "white" },
    "&:hover": { background: "var(--forest-green)", color: "white" },
  },
};

// used in login page
export const grayBorderTextField = {
  width: 350,
  fontSize: "1.1rem",
  height: 48,
  borderRadius: "10px",
  border: "2px solid var(--blue-gray)",
  "& fieldset": { border: "none" },
};

// search bar
export const grayBorderSearchBar = {
  ...baseStyles,
  width: "55%",
  border: "2px solid var(--blue-gray)",
  "& fieldset": { border: "none" },
};

// Radio Button, used in quiz component
export const grayRadioButton = {
  color: "var( --blue-gray)",
  "&.Mui-checked": {
    color: "var( --blue-gray)",
  },
};

// stepper, used in training page
export const stepperStyle = {
  "& .MuiStepLabel-root .Mui-completed": {
    color: "var(--blue-gray)", // circle color (COMPLETED)
    padding: "0",
  },
  "& .MuiStepLabel-root .Mui-active": {
    color: "var(--blue-gray)", // circle color (ACTIVE)
    padding: "0",
  },
  "& .Mui-disabled .MuiStepIcon-root": {
    color: "white", // circle color (DISABLED)
    padding: "0",
  },
  "& .MuiStepLabel-root .MuiStepLabel-iconContainer": {
    padding: "0", // remove padding next to step label
  },
  "& .MuiStepConnector-line": {
    borderTopWidth: "2px", // connector width
  },
  "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
    borderColor: "var(--blue-gray)", // connector color (COMPLETED)
  },
  "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
    borderColor: "var(--blue-gray)", // connector color (ACTIVE)
  },
  "& .MuiStepConnector-root.Mui-disabled .MuiStepConnector-line": {
    borderColor: "var(--blue-gray)", // connector color (DISABLED)
  },
};

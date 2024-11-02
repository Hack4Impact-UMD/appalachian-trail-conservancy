import { createTheme, styled } from "@mui/material";
import { numberInputClasses } from "@mui/base/Unstable_NumberInput";

declare module "@mui/material/styles" {
  interface PaletteColor {
    forestGreen?: string;
    skyBlue?: string;
    blueGrey?: string;
  }
}

// Initialized then overridden
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

// base button style
export const styledRectButton = {
  width: 350,
  marginTop: "5%",
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

// forest green button with padding, custom size, and font size
export const forestGreenButtonLarge = {
  ...forestGreenButtonPadding,
  padding: "27px 27px",
  fontSize: "20px",
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

// gray radio button
export const grayRadioButton = {
  color: "var(--blue-gray)",
  "&.Mui-checked": {
    color: "var(--blue-gray)",
  },
  "&.Mui-disabled": {
    color: "var(--blue-gray)",
  },
};

// green radio button
export const greenRadioButton = {
  color: "var(--forest-green)",
  "&.Mui-checked": {
    color: "var(--forest-green)",
  },
  "&.Mui-disabled": {
    color: "var(--forest-green)",
  },
};

// red radio button
export const redRadioButton = {
  color: "red",
  "&.Mui-checked": {
    color: "red",
  },
  "&.Mui-disabled": {
    color: "red",
  },
};

// gray radio button, green when selected
export const grayGreenRadioButton = {
  color: "var(--blue-gray)",
  "&.Mui-checked": {
    color: "var(--forest-green)",
  },
  "&.Mui-disabled": {
    color: "var(--blue-gray)",
  },
};

// number input
export const numberInputRoot = styled("div")(() => ({
  borderRadius: "4px",
  color: "var(--blue-gray)",
  background: "#fff",
  border: `1px solid var(--blue-gray)`,
  display: "grid",
  gridTemplateColumns: "1fr 15px",
  gridTemplateRows: "1fr 1fr",
  overflow: "hidden",
  columnGap: "2px",
  padding: "2px",
  width: "3rem",
  height: "1.6rem",
  marginTop: "0",
  marginLeft: "1rem",
  alignItems: "center",
  boxSizing: "border-box",

  "&:focus-visible": {
    outline: 0,
  },
}));

// number input
export const numberInputElement = styled("input")(() => ({
  fontSize: "0.9rem",
  fontFamily: "inherit",
  fontWeight: "bold",
  lineHeight: 1.5,
  gridColumn: "1/2",
  gridRow: "1/3",
  color: "var(--blue-gray)",
  background: "inherit",
  border: "none",
  borderRadius: "inherit",
  padding: "2px 2px",
  outline: 0,
  width: "100%",
  height: "100%",
  textAlign: "center",
  boxSizing: "border-box",
}));

// number input
export const numberInputButton = styled("button")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 0,
  width: "10px",
  height: "10px",
  fontSize: "0.675rem",
  lineHeight: 1,
  background: "#fff",
  border: 0,
  color: "var(--blue-gray)",
  transition: "all 120ms cubic-bezier(0.4, 0, 0.2, 1)",
  boxSizing: "border-box",

  "&:hover": {
    background: "var(--blue-gray)",
    cursor: "pointer",
  },

  [`&.${numberInputClasses.incrementButton}`]: {
    gridColumn: "2",
    gridRow: "1",
    border: "0",
    borderBottom: 0,
    background: "#fff",
    color: "var(--blue-gray)",
    "&::before": {
      content: '"▲"',
    },
  },

  [`&.${numberInputClasses.decrementButton}`]: {
    gridColumn: "2",
    gridRow: "2",
    border: "0",
    background: "#fff",
    color: "var(--blue-gray)",
    "&::before": {
      content: '"▼"',
    },
  },
}));

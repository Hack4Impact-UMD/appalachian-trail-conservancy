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

//These colors should mirror the colors found in "index.css"
theme = createTheme(theme, {
  palette: {
    primary: {
      forestGreen: "#0a7650",
      skyBlue: "#b1d7e8",
      blueGray: "#263843",
      oceanGreen: "#49a772",
      shadowGreen: "#6cb29a",
      mintGreen: "#82c9a0",
      icebergBlue: "#cde3e4",
    },
  },
});

export default theme;

export const styledButtonGreen = {
  borderRadius: "20px",
  boxShadow: "none",
  color: "white",
  backgroundColor: "var(--ocean-green)",
  border: "2px solid var(--ocean-green)",
  "&:hover": {
    backgroundColor: "var(--ocean-green)",
    color: "white",
  },
};

export const styledButtonWhite = {
  borderRadius: "20px",
  boxShadow: "none",
  color: "var(--ocean-green)",
  backgroundColor: "white",
  border: "2px solid var(--ocean-green)",
  "&:hover": {
    backgroundColor: "white",
    color: "var(--ocean-green)",
  },
};

export const styledButtonWhiteBlack = {
  boxShadow: "none",
  color: "black",
  backgroundColor: "white",
  border: "2px solid black",
  borderRadius: "20px",
  "&:hover": {
    color: "white",
    backgroundColor: "var(--ocean-green)",
  },
};

export const styledInputBoxes = {
  border: "1px solid black",
  borderRadius: "8px",
  width: 350,
  height: 40,
  "& fieldset": { border: "none" },
};

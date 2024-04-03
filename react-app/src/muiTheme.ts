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

const styledButton = {
  borderRadius: "10px",
  boxShadow: "none",
};

// dark green button
export const styledButtonGreen = {
  ...styledButton,
  color: "white",
  backgroundColor: "var(--forest-green)",
  border: "2px solid var(--forest-green)",
  "&:hover": {
    backgroundColor: "var(--forest-green)",
    color: "white",
  },
};

// white with dark green borders
export const styledButtonWhiteGreen = {
  ...styledButton,
  color: "var(--forest-green)",
  backgroundColor: "white",
  border: "2px solid var(--forest-green)",
  "&:hover": {
    backgroundColor: "white",
    color: "var(--forest-green)",
  },
};

export const darkGreenButton = {
  borderRadius: "20px",
  boxShadow: "none",
  color: "white",
  paddingLeft: "20px",
  paddingRight: "20px",
  height: 44,
  backgroundColor: "var(--forest-green)",
  border: "2px solid var(--forest-green)",
  "&:hover": {
    backgroundColor: "var(--forest-green)",
    color: "white",
  },
};

export const whiteEmptyButton = {
  borderRadius: "20px",
  boxShadow: "none",
  color: "black",
  paddingLeft: "20px",
  paddingRight: "20px",
  height: 44,
  backgroundColor: "white",
  border: "2px solid black",
  "&:hover": {
    backgroundColor: "white",
    color: "black",
  },
};

// white with dark gray borders
export const styledButtonWhiteBlack = {
  ...styledButton,
  color: "dimgray",
  backgroundColor: "white",
  border: "2px solid dimgray",
  "&:hover": {
    backgroundColor: "white",
    color: "var(--ocean-green)",
  },
};

export const styledSelectWhiteBlack = {
  borderColor: "dimgray",
  height: '40px',
  color: "dimgray",
  backgroundColor: "white",
  boxShadow: "none",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  fontWeight: '500',
  fontSize: '0.875rem'
};

// used in login page
export const styledInputBoxes = {
  border: "1px solid black",
  borderRadius: "8px",
  width: 350,
  height: 40,
  "& fieldset": { border: "none" },
};

export const styledLibrarySearchBar = {
  border: "2px solid var(--blue-gray)",
  borderRadius: "10px",
  width: "55%",
  height: 40,
  "& fieldset": { border: "none" },
};

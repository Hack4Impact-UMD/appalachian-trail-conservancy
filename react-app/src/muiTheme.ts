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

theme = createTheme(theme, {
  palette: {
    primary: {
      forestGreen: "#0a7650",
      skyBlue: "#b1d7e8",
      blueGray: "#263843",
    },
  },
});

export default theme;

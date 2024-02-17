import { ThemeProvider } from "@mui/material";
import theme from "./muiTheme.ts";

function App() {
  return <ThemeProvider theme={theme}>App</ThemeProvider>;
}

export default App;

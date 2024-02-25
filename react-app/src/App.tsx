import { ThemeProvider } from "@mui/material";
import theme from "./muiTheme.ts";
import NavigationBar from "./components/NavigationBar/NavigationBar.tsx";

function App() {
  const handleItemClick = (item: string) => {
    console.log(`Clicked on ${item}`);
    // Here you can add the logic to navigate to different pages
    // based on the clicked item
  };

  // return <ThemeProvider theme={theme}>App</ThemeProvider>;
  return <NavigationBar activeItem="Dashboard" onItemClick={handleItemClick} />;
}

export default App;

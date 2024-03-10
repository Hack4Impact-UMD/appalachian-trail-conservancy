import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TrainingsInProgressPage from "./pages/TrainingsInProgressPage/TrainingsInProgressPage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import Dashboard from "./pages/DashboardPage/DashboardPage.tsx";
import TrainingsCompletedPage from "./pages/TrainingsCompletedPage/TrainingsCompletedPage.tsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.tsx";
import TrainingLibrary from "./pages/TrainingLibraryPage/TrainingLibraryPage.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./muiTheme.ts";
import NavigationBar from "./components/NavigationBar/NavigationBar.tsx";
import { useState } from "react";

function App() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Function to handle item click
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <>
      <TrainingLibrary />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <NavigationBar
                  activeItem={activeItem}
                  onItemClick={handleItemClick}
                />
              }
            />
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/trainingsInProgress"
              element={<TrainingsInProgressPage />}
            />
            <Route
              path="/trainingsCompleted"
              element={<TrainingsCompletedPage />}
            />
            <Route path="/trainingLibrary" element={<TrainingLibrary />} />
            <Route path="/*" element={<NotFoundPage />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;

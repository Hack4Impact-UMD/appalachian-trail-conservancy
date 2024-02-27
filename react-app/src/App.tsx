import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TrainingsInProgressPage from "./pages/TrainingsInProgressPage/TrainingsInProgressPage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import Dashboard from "./pages/DashboardPage/DashboardPage.tsx";
import TrainingsCompletedPage from "./pages/TrainingsCompletedPage/TrainingsCompletedPage.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./muiTheme.ts";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

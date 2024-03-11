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
import VolunteerLoginPage from "./pages/LoginPage/VolunteerLoginPage/VolunteerLoginPage.tsx";
import AdminLoginPage from "./pages/LoginPage/AdminLoginPage/AdminLoginPage.tsx";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/user" element={<VolunteerLoginPage />} />
          <Route path="/login/admin" element={<AdminLoginPage />} />
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
  );
}

export default App;

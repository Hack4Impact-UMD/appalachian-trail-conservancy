import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.tsx";
import PathwayPage from "./pages/PathwayPage/PathwayPage.tsx";
import QuizPage from "./pages/QuizPage/QuizPage.tsx";
import TrainingPage from "./pages/TrainingPage/TrainingPage.tsx";
import TrainingsInProgressPage from "./pages/TrainingsInProgressPage/TrainingsInProgressPage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import Dashboard from "./pages/DashboardPage/Dashboard.tsx";
import TrainingCompletedPage from "./pages/TrainingCompletedPage/TrainingCompletedPage.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./muiTheme.ts";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pathway" element={<PathwayPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route
            path="/trainingsInProgress"
            element={<TrainingsInProgressPage />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/trainingCompleted"
            element={<TrainingCompletedPage />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

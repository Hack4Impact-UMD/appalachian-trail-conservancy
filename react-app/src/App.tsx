import "./index.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import theme from "./muiTheme.ts";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import Dashboard from "./pages/DashboardPage/DashboardPage.tsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.tsx";
import TrainingLibrary from "./pages/TrainingLibraryPage/TrainingLibraryPage.tsx";
import VolunteerLoginPage from "./pages/LoginPage/VolunteerLoginPage/VolunteerLoginPage.tsx";
import AdminLoginPage from "./pages/LoginPage/AdminLoginPage/AdminLoginPage.tsx";
import AchievementsPage from "./pages/AchievementsPage/AchievementsPage.tsx";
import TrainingPage from "./pages/TrainingPage/TrainingPage.tsx";
import TrainingLandingPage from "./pages/TrainingLandingPage/TrainingLandingPage.tsx";
import PathwayLandingPage from "./pages/PathwayLandingPage/PathwayLandingPage.tsx";
import RequireAuth from "./auth/RequireAuth/RequireAuth.tsx";
import LogoutPage from "./pages/LogoutPage/LogoutPage.tsx";
import QuizPage from "./pages/QuizPage/QuizPage.tsx";
import QuizResult from "./pages/QuizResultPage/QuizResultPage.tsx";
import QuizLandingPage from "./pages/QuizLandingPage/QuizLandingPage.tsx";
import PathwayLibrary from "./pages/PathwayLibraryPage/PathwayLibraryPage.tsx";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage/RegistrationPage.tsx";
import RegistrationConfirmationPage from "./pages/RegistrationPage/RegistrationConfirmationPage/RegistrationConfirmationPage.tsx";
import { useAuth } from "./auth/AuthProvider.tsx";

function App() {
  const auth = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/volunteer" element={<VolunteerLoginPage />} />
            <Route path="/login/admin" element={<AdminLoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route
              path="/registration-confirmation"
              element={<RegistrationConfirmationPage />}
            />

            <Route
              path="/"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/trainings"
              element={
                <RequireAuth>
                  <TrainingLibrary />
                </RequireAuth>
              }
            />
            <Route
              path="/trainings/:id"
              element={
                <RequireAuth>
                  <TrainingLandingPage />
                </RequireAuth>
              }
            />
            <Route
              path="/trainings/resources"
              element={
                <RequireAuth>
                  <TrainingPage />
                </RequireAuth>
              }
            />
            <Route
              path="/trainings/quizlanding"
              element={
                <RequireAuth>
                  <QuizLandingPage />
                </RequireAuth>
              }
            />
            <Route
              path="/trainings/quiz"
              element={
                <RequireAuth>
                  <QuizPage />
                </RequireAuth>
              }
            />
            <Route
              path="/trainings/quizresult"
              element={
                <RequireAuth>
                  <QuizResult />
                </RequireAuth>
              }
            />
            <Route
              path="/pathways"
              element={
                <RequireAuth>
                  <PathwayLibrary />
                </RequireAuth>
              }
            />
            <Route
              path="/pathways/:id"
              element={
                <RequireAuth>
                  <PathwayLandingPage />
                </RequireAuth>
              }
            />
            <Route
              path="/achievements"
              element={
                <RequireAuth>
                  <AchievementsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <NotFoundPage />
                </RequireAuth>
              }
            />

            <Route
              path="/testfunctions"
              element={
                <RequireAuth>
                  <button
                    onClick={() => {
                      //insert test function here
                    }}
                  >
                    TEST
                  </button>
                </RequireAuth>
              }
            />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

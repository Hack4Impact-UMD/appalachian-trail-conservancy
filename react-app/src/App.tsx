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
import RequireAdminAuth from "./auth/RequireAdminAuth/RequireAdminAuth.tsx";
import RequireVolunteerAuth from "./auth/RequireVolunteerAuth/RequireVolunteerAuth.tsx";
import LogoutPage from "./pages/LogoutPage/LogoutPage.tsx";
import QuizPage from "./pages/QuizPage/QuizPage.tsx";
import QuizResult from "./pages/QuizResultPage/QuizResultPage.tsx";
import QuizLandingPage from "./pages/QuizLandingPage/QuizLandingPage.tsx";
import PathwayLibrary from "./pages/PathwayLibraryPage/PathwayLibraryPage.tsx";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage/RegistrationPage.tsx";
import RegistrationConfirmationPage from "./pages/RegistrationPage/RegistrationConfirmationPage/RegistrationConfirmationPage.tsx";
import AdminDashboard from "./pages/AdminDashboardPage/AdminDashboardPage.tsx";
import AdminTrainingLibrary from "./pages/AdminTrainingLibraryPage/AdminTrainingLibraryPage.tsx";
import AdminPathwayLibrary from "./pages/AdminPathwayLibraryPage/AdminPathwayLibraryPage.tsx";

function App() {
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
                <RequireVolunteerAuth>
                  <Dashboard />
                </RequireVolunteerAuth>
              }
            />

            <Route
              path="/admin"
              element={
                <RequireAdminAuth>
                  <AdminDashboard />
                </RequireAdminAuth>
              }
            />

            <Route
              path="/admin/trainings"
              element={
                <RequireAdminAuth>
                  <AdminTrainingLibrary />
                </RequireAdminAuth>
              }
            />

            <Route
              path="/admin/pathways"
              element={
                <RequireAdminAuth>
                  <AdminPathwayLibrary />
                </RequireAdminAuth>
              }
            />

            <Route
              path="/trainings"
              element={
                <RequireVolunteerAuth>
                  <TrainingLibrary />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/trainings/:id"
              element={
                <RequireVolunteerAuth>
                  <TrainingLandingPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/trainings/resources"
              element={
                <RequireVolunteerAuth>
                  <TrainingPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/trainings/quizlanding"
              element={
                <RequireVolunteerAuth>
                  <QuizLandingPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/trainings/quiz"
              element={
                <RequireVolunteerAuth>
                  <QuizPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/trainings/quizresult"
              element={
                <RequireVolunteerAuth>
                  <QuizResult />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/pathways"
              element={
                <RequireVolunteerAuth>
                  <PathwayLibrary />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/pathways/:id"
              element={
                <RequireVolunteerAuth>
                  <PathwayLandingPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/achievements"
              element={
                <RequireVolunteerAuth>
                  <AchievementsPage />
                </RequireVolunteerAuth>
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

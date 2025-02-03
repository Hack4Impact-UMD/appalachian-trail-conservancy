import "./index.css";
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { AuthProvider, useAuth } from "./auth/AuthProvider.tsx";
import theme from "./muiTheme.ts";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import Dashboard from "./pages/DashboardPage/DashboardPage.tsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.tsx";
import TrainingLibrary from "./pages/TrainingLibraryPage/TrainingLibraryPage.tsx";
import VolunteerLoginPage from "./pages/LoginPage/VolunteerLoginPage/VolunteerLoginPage.tsx";
import AdminLoginPage from "./pages/LoginPage/AdminLoginPage/AdminLoginPage.tsx";
import VolunteerAchievementsPage from "./pages/VolunteerAchievementsPage/VolunteerAchievementsPage.tsx";
import TrainingPage from "./pages/TrainingPage/TrainingPage.tsx";
import TrainingLandingPage from "./pages/TrainingLandingPage/TrainingLandingPage.tsx";
import PathwayLandingPage from "./pages/PathwayLandingPage/PathwayLandingPage.tsx";
import RequireAuth from "./auth/RequireAuth/RequireAuth.tsx";
import RequireAdminAuth from "./auth/RequireAdminAuth/RequireAdminAuth.tsx";
import RequireVolunteerAuth from "./auth/RequireVolunteerAuth/RequireVolunteerAuth.tsx";
import LogoutPage from "./pages/LogoutPage/LogoutPage.tsx";
import QuizPage from "./pages/QuizPage/QuizPage.tsx";
import QuizResultPage from "./pages/QuizResultPage/QuizResultPage.tsx";
import QuizLandingPage from "./pages/QuizLandingPage/QuizLandingPage.tsx";
import PathwayLibrary from "./pages/PathwayLibraryPage/PathwayLibraryPage.tsx";
import PathwayQuizLandingPage from "./pages/PathwayQuizLandingPage/PathwayQuizLandingPage.tsx";
import PathwayQuizPage from "./pages/PathwayQuizPage/PathwayQuizPage.tsx";
import PathwayQuizResultPage from "./pages/PathwayQuizResultPage/PathwayQuizResultPage.tsx";
import AdminTrainingEditorPage from "./pages/AdminTrainingEditorPage/AdminTrainingEditorPage.tsx";
import AdminPathwayEditorPage from "./pages/AdminPathwayEditorPage/AdminPathwayEditorPage.tsx";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage/RegistrationPage.tsx";
import RegistrationConfirmationPage from "./pages/RegistrationPage/RegistrationConfirmationPage/RegistrationConfirmationPage.tsx";
import PathwayQuizEditorPage from "./pages/AdminPathwayQuizEditorPage/AdminPathwayQuizEditorPage.tsx";
import TrainingQuizEditorPage from "./pages/AdminTrainingQuizEditorPage/AdminTrainingQuizEditorPage.tsx";
import AdminDashboard from "./pages/AdminDashboardPage/AdminDashboardPage.tsx";
import AdminTrainingLibrary from "./pages/AdminTrainingLibraryPage/AdminTrainingLibraryPage.tsx";
import AdminPathwayLibrary from "./pages/AdminPathwayLibraryPage/AdminPathwayLibraryPage.tsx";
import AdminRegistrationManagementPage from "./pages/AdminRegistrationManagementPage/AdminRegistrationManagementPage.tsx";
import AdminUserManagementPage from "./pages/AdminUserManagementPage/AdminUserManagementPage.tsx";
import VolunteerProfilePage from "./pages/VolunteerProfilePage/VolunteerProfilePage.tsx";
import AdminProfilePage from "./pages/AdminProfilePage/AdminProfilePage.tsx";
import AdminVolunteerDetailsPage from "./pages/AdminVolunteerDetailsPage/AdminVolunteerDetailsPage.tsx";
import AdminPathwayDetailsPage from "./pages/AdminPathwayDetailsPage/AdminPathwayDetailsPage.tsx";
import AdminTrainingDetailsPage from "./pages/AdminTrainingDetailsPage/AdminTrainingDetailsPage.tsx";

interface RoleBasedRouteProps {
  adminComponent: JSX.Element;
  volunteerComponent: JSX.Element;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  adminComponent,
  volunteerComponent,
}) => {
  const authContext = useAuth();

  if (authContext.token?.claims?.role === "ADMIN") {
    return <RequireAdminAuth>{adminComponent}</RequireAdminAuth>;
  } else {
    return <RequireVolunteerAuth>{volunteerComponent}</RequireVolunteerAuth>;
  }
};

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
            <Route path="/register" element={<RegistrationPage />} />
            <Route
              path="/registration-confirmation"
              element={<RegistrationConfirmationPage />}
            />
            <Route
              path="/"
              element={
                <RoleBasedRoute
                  adminComponent={<AdminDashboard />}
                  volunteerComponent={<Dashboard />}
                />
              }
            />
            <Route
              path="/trainings"
              element={
                <RoleBasedRoute
                  adminComponent={<AdminTrainingLibrary />}
                  volunteerComponent={<TrainingLibrary />}
                />
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
                  <QuizResultPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/trainings/editor"
              element={
                <RequireAdminAuth>
                  <AdminTrainingEditorPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/trainings/editor/quiz"
              element={
                <RequireAdminAuth>
                  <TrainingQuizEditorPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/pathways"
              element={
                <RoleBasedRoute
                  adminComponent={<AdminPathwayLibrary />}
                  volunteerComponent={<PathwayLibrary />}
                />
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
              path="/pathways/editor"
              element={
                <RequireAdminAuth>
                  <AdminPathwayEditorPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/pathways/editor/quiz"
              element={
                <RequireAdminAuth>
                  <PathwayQuizEditorPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/pathways/quizlanding"
              element={
                <RequireVolunteerAuth>
                  <PathwayQuizLandingPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/pathways/quiz"
              element={
                <RequireVolunteerAuth>
                  <PathwayQuizPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/pathways/quizresult"
              element={
                <RequireVolunteerAuth>
                  <PathwayQuizResultPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/achievements"
              element={
                <RequireVolunteerAuth>
                  <VolunteerAchievementsPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/management"
              element={
                <RequireAdminAuth>
                  <AdminUserManagementPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/management/volunteer/:id"
              element={
                <RequireAdminAuth>
                  <AdminVolunteerDetailsPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/management/pathway/:id"
              element={
                <RequireAdminAuth>
                  <AdminPathwayDetailsPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/management/training/:id"
              element={
                <RequireAdminAuth>
                  <AdminTrainingDetailsPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/registration"
              element={
                <RequireAdminAuth>
                  <AdminRegistrationManagementPage />
                </RequireAdminAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RoleBasedRoute
                  adminComponent={<AdminProfilePage />}
                  volunteerComponent={<VolunteerProfilePage />}
                />
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
                  <button onClick={async () => {}}>TEST</button>
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

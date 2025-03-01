import "./index.css";
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { AuthProvider, useAuth } from "./auth/AuthProvider.tsx";
import RequireAuth from "./auth/RequireAuth/RequireAuth.tsx";
import RequireAdminAuth from "./auth/RequireAdminAuth/RequireAdminAuth.tsx";
import RequireVolunteerAuth from "./auth/RequireVolunteerAuth/RequireVolunteerAuth.tsx";
import theme from "./muiTheme.ts";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import LogoutPage from "./pages/LogoutPage/LogoutPage.tsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.tsx";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage/RegistrationPage.tsx";
import RegistrationConfirmationPage from "./pages/RegistrationPage/RegistrationConfirmationPage/RegistrationConfirmationPage.tsx";
import VolunteerDashboard from "./pages/VolunteerDashboardPage/VolunteerDashboardPage.tsx";
import VolunteerTrainingLibrary from "./pages/VolunteerTrainingLibraryPage/VolunteerTrainingLibraryPage.tsx";
import VolunteerLoginPage from "./pages/LoginPage/VolunteerLoginPage/VolunteerLoginPage.tsx";
import VolunteerAchievementsPage from "./pages/VolunteerAchievementsPage/VolunteerAchievementsPage.tsx";
import VolunteerTrainingPage from "./pages/VolunteerTrainingPage/VolunteerTrainingPage.tsx";
import VolunteerTrainingLandingPage from "./pages/VolunteerTrainingLandingPage/VolunteerTrainingLandingPage.tsx";
import VolunteerPathwayLandingPage from "./pages/VolunteerPathwayLandingPage/VolunteerPathwayLandingPage.tsx";
import VolunteerTrainingQuizPage from "./pages/VolunteerTrainingQuizPage/VolunteerTrainingQuizPage.tsx";
import VolunteerTrainingQuizResultPage from "./pages/VolunteerTrainingQuizResultPage/VolunteerTrainingQuizResultPage.tsx";
import VolunteerTrainingQuizLandingPage from "./pages/VolunteerTrainingQuizLandingPage/VolunteerTrainingQuizLandingPage.tsx";
import VolunteerPathwayLibrary from "./pages/VolunteerPathwayLibraryPage/VolunteerPathwayLibraryPage.tsx";
import VolunteerPathwayQuizLandingPage from "./pages/VolunteerPathwayQuizLandingPage/VolunteerPathwayQuizLandingPage.tsx";
import VolunteerPathwayQuizPage from "./pages/VolunteerPathwayQuizPage/VolunteerPathwayQuizPage.tsx";
import VolunteerPathwayQuizResultPage from "./pages/VolunteerPathwayQuizResultPage/VolunteerPathwayQuizResultPage.tsx";
import VolunteerProfilePage from "./pages/VolunteerProfilePage/VolunteerProfilePage.tsx";
import VolunteerChangeEmailPage from "./pages/VolunteerChangeEmailPage/VolunteerChangeEmailPage.tsx";
import AdminLoginPage from "./pages/LoginPage/AdminLoginPage/AdminLoginPage.tsx";
import AdminTrainingEditorPage from "./pages/AdminTrainingEditorPage/AdminTrainingEditorPage.tsx";
import AdminPathwayEditorPage from "./pages/AdminPathwayEditorPage/AdminPathwayEditorPage.tsx";
import PathwayQuizEditorPage from "./pages/AdminPathwayQuizEditorPage/AdminPathwayQuizEditorPage.tsx";
import TrainingQuizEditorPage from "./pages/AdminTrainingQuizEditorPage/AdminTrainingQuizEditorPage.tsx";
import AdminDashboard from "./pages/AdminDashboardPage/AdminDashboardPage.tsx";
import AdminTrainingLibrary from "./pages/AdminTrainingLibraryPage/AdminTrainingLibraryPage.tsx";
import AdminPathwayLibrary from "./pages/AdminPathwayLibraryPage/AdminPathwayLibraryPage.tsx";
import AdminRegistrationManagementPage from "./pages/AdminRegistrationManagementPage/AdminRegistrationManagementPage.tsx";
import AdminUserManagementPage from "./pages/AdminUserManagementPage/AdminUserManagementPage.tsx";
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
      <HashRouter>
        <AuthProvider>
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
                  volunteerComponent={<VolunteerDashboard />}
                />
              }
            />
            <Route
              path="/trainings"
              element={
                <RoleBasedRoute
                  adminComponent={<AdminTrainingLibrary />}
                  volunteerComponent={<VolunteerTrainingLibrary />}
                />
              }
            />
            <Route
              path="/trainings/:id"
              element={
                <RequireVolunteerAuth>
                  <VolunteerTrainingLandingPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/trainings/resources"
              element={
                <RequireVolunteerAuth>
                  <VolunteerTrainingPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/trainings/quizlanding"
              element={
                <RequireVolunteerAuth>
                  <VolunteerTrainingQuizLandingPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/trainings/quiz"
              element={
                <RequireVolunteerAuth>
                  <VolunteerTrainingQuizPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/trainings/quizresult"
              element={
                <RequireVolunteerAuth>
                  <VolunteerTrainingQuizResultPage />
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
                  volunteerComponent={<VolunteerPathwayLibrary />}
                />
              }
            />
            <Route
              path="/pathways/:id"
              element={
                <RequireVolunteerAuth>
                  <VolunteerPathwayLandingPage />
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
                  <VolunteerPathwayQuizLandingPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/pathways/quiz"
              element={
                <RequireVolunteerAuth>
                  <VolunteerPathwayQuizPage />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/pathways/quizresult"
              element={
                <RequireVolunteerAuth>
                  <VolunteerPathwayQuizResultPage />
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
              path="/changeemail"
              element={
                <RequireVolunteerAuth>
                  <VolunteerChangeEmailPage />
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
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;

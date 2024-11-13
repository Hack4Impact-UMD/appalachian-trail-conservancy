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
import AdminTrainingEditor from "./pages/AdminTrainingEditor/AdminTrainingEditor.tsx";
import AdminPathwayEditor from "./pages/AdminPathwayEditor/AdminPathwayEditor.tsx";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage/RegistrationPage.tsx";
import RegistrationConfirmationPage from "./pages/RegistrationPage/RegistrationConfirmationPage/RegistrationConfirmationPage.tsx";
import PathwayQuizEditorPage from "./pages/AdminPathwayQuizEditorPage/AdminPathwayQuizEditorPage.tsx";
import TrainingQuizEditorPage from "./pages/AdminTrainingQuizEditorPage/AdminTrainingQuizEditorPage.tsx";
import AdminDashboard from "./pages/AdminDashboardPage/AdminDashboardPage.tsx";
import AdminTrainingLibrary from "./pages/AdminTrainingLibraryPage/AdminTrainingLibraryPage.tsx";
import AdminPathwayLibrary from "./pages/AdminPathwayLibraryPage/AdminPathwayLibraryPage.tsx";

import { addEmail, updateEmail } from "./backend/AdminFirestoreCall.ts";
import { EmailType } from "./types/AssetsType.ts";

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
            <Route path="/registration" element={<RegistrationPage />} />
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
                  <QuizResult />
                </RequireVolunteerAuth>
              }
            />
            <Route
              path="/trainings/editor"
              element={
                <RequireAdminAuth>
                  <AdminTrainingEditor />
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
                  <AdminPathwayEditor />
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
                    onClick={async () => {
                      const email: EmailType = {
                        type: "EMAIL",
                        dateUpdated: "2024/11/11",
                        subject: "ATC Registration",
                        body: `
                        <div>
                          <div style="max-width: 600px; margin: auto">
                            <br><br><br>
                            <p style="font-size: 16px">
                            Hello,<br>
                            <br>
                            Your account has been created.<br>
                            <br>
                            <span style="font-weight: 600; text-decoration: underline">Appalachian Trail Conservancy Training Portal</span><br>
                            <br>
                            Please look out for a reset password email which will allow you to reset your password for security purposes.
                          <div>
                        </div>
                      `,
                      };
                      updateEmail(email).then(() => {
                        console.log("success");
                      });
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

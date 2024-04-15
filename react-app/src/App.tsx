import "./index.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import { createVolunteerUser } from "./backend/AuthFunctions";
import theme from "./muiTheme.ts";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import Dashboard from "./pages/DashboardPage/DashboardPage.tsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.tsx";
import TrainingLibrary from "./pages/TrainingLibraryPage/TrainingLibraryPage.tsx";
import PathwayLibrary from "./pages/PathwayLibraryPage/PathwayLibraryPage.tsx";
import VolunteerLoginPage from "./pages/LoginPage/VolunteerLoginPage/VolunteerLoginPage.tsx";
import AdminLoginPage from "./pages/LoginPage/AdminLoginPage/AdminLoginPage.tsx";
import AchievementsPage from "./pages/AchievementsPage/AchievementsPage.tsx";
import TrainingPage from "./pages/TrainingPage/TrainingPage.tsx";
import RequireAuth from "./auth/RequireAuth/RequireAuth.tsx";
import LogoutPage from "./pages/LogoutPage/LogoutPage.tsx";
import QuizResult from "./pages/QuizPage/QuizResult/QuizResult.tsx";
import QuizCard from "./pages/QuizPage/QuizComponent/QuizCard/QuizCard.tsx";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/volunteer" element={<VolunteerLoginPage />} />
            <Route path="/login/admin" element={<AdminLoginPage />} />
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
              path="/trainingpage"
              element={
                <RequireAuth>
                  <TrainingPage />
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
              }></Route>
            <Route
              path="/logout"
              element={
                <RequireAuth>
                  <LogoutPage />
                </RequireAuth>
              }
            />

            <Route
              path="/testfunctions"
              element={
                <RequireAuth>
                  <button
                    onClick={() => {
                      //Test function
                      createVolunteerUser(
                        "h4iatctest@gmail.com",
                        "Akash",
                        "Patil",
                        123
                      );
                    }}>
                    TEST
                  </button>
                </RequireAuth>
              }
            />
            <Route
              path="/quizcard"
              element={
                <RequireAuth>
                  <QuizCard
                    currentQuestion={1}
                    totalQuestions={10}
                    question={"What is 2 + 2?"}
                    answerOptions={["1", "9", "-2", "4"]}
                  />
                </RequireAuth>
              }
            />
            <Route
              path="/quizresult"
              element={
                <RequireAuth>
                  <QuizResult
                    achievedScore={5}
                    totalScore={10}
                    passingScore={5}
                  />
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

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
import QuizPage from "./pages/QuizPage/QuizPage.tsx";
import QuizResult from "./pages/QuizResultPage/QuizResultPage.tsx";
import QuizResultCard from "./pages/QuizResultPage/QuizResultCard/QuizResultCard.tsx";

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
              path="/quizresultcard"
              element={
                <RequireAuth>
                  <QuizResultCard
                    currentQuestion={2}
                    question={"What is the capital of France?"}
                    answerOptions={["London", "Paris", "Berlin"]}
                    selectedAnswer={"Paris"}
                    correctAnswer={"Berlin"}
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
            <Route
              path="/quiz"
              element={
                <RequireAuth>
                  <QuizPage />
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

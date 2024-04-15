import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "./auth/AuthProvider.tsx";
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
import QuizResultCard from "./pages/QuizPage/QuizComponent/QuizResultCard/QuizResultCard.tsx";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
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
              path="/quizresultcard"
              element={
                <RequireAuth>
                  <QuizResultCard
                    currentQuestion={2}
                    totalQuestions={3}
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

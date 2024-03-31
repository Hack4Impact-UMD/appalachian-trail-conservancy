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
import NavigationBar from "./components/NavigationBar/NavigationBar.tsx";
import QuizCard from "./pages/QuizComponent/QuizCard/QuizCard.tsx";
import { useState } from "react";

function App() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Function to handle item click
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };
  const quizData = {
    currentQuestion: 1,
    totalQuestions: 5,
    question: "What is the capital of France?",
    answerOptions: ["Paris", "Berlin", "London", "Madrid"],
  };
  return (
    <>
      <QuizCard
        currentQuestion={quizData.currentQuestion}
        totalQuestions={quizData.totalQuestions}
        question={quizData.question}
        answerOptions={quizData.answerOptions}
      />
      {/* <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/nav"
              element={
                <NavigationBar
                  activeItem={activeItem}
                  onItemClick={handleItemClick}
                />
              }
            />

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
      </ThemeProvider> */}
    </>
  );
}

export default App;

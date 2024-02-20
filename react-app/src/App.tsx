import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.tsx";
import PathwayPage from "./pages/PathwayPage/PathwayPage.tsx";
import QuizPage from "./pages/QuizPage/QuizPage.tsx";
import TrainingPage from "./pages/TrainingPage/TrainingPage.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./muiTheme.ts";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/PathwayPage" element={<PathwayPage />} />
          <Route path="/QuizPage" element={<QuizPage />} />
          <Route path="/TrainingPage" element={<TrainingPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

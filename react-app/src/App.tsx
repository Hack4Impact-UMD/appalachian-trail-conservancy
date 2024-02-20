import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {BrowserRouter, Route, Routes } from "react-router-dom";
import homePage from "./pages/HomePage"
import pathwayPage from "./pages/PathwayPage"
import quizPage from "./pages/QuizPage"
import trainingPage from "./pages/TrainingPage"
import { ThemeProvider } from "@mui/material";
import theme from "./muiTheme.ts";

function App() {
   return <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path = "/pages/HomePage" element = {<homePage/>}/>
        <Route path = "/pages/PathwayPage" element = {<pathwayPage/>}/>
        <Route path = "/pages/QuizPage" element = {<quizPage/>}/>
        <Route path = "/pages/TrainingPage" element = {<trainingPage/>}/>
    </Routes>
  </BrowserRouter>
 </ThemeProvider>;
}

export default App;

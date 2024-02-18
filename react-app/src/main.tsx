import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import homePage from "./pages/homePage"
import pathwayPage from "./pages/pathwayPage"
import quizPage from "./pages/quizPage"
import trainingPage from "./pages/trainingPage"

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path = "/pages/homePage" element = {<homePage/>}/>
				<Route path = "/pages/pathwayPage" element = {<pathwayPage/>}/>
				<Route path = "/pages/quizPage" element = {<quizPage/>}/>
				<Route path = "/pages/trainingPage" element = {<trainingPage/>}/>
			</Routes>
		</Router>
	</React.StrinctMode>

);

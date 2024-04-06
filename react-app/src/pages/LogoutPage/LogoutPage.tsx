import React from "react";
import logo from "../../assets/atc-primary-logo.png";
import greenCheck from "../../assets/greenCircleCheck.svg";
import "./LogoutPage.css";
import { Link } from "react-router-dom";

const LogoutPage: React.FC = () => {
  return (
    <div className="centered-container">
      <img src={logo} alt="Logo" className="logo" />
      <img src={greenCheck} alt="Green Check" className="checkmark" />
      <h1 className="logout-text">You have been logged out</h1>

      <Link to="/login">
        <button className="sign-in-button">Sign in Again</button>
      </Link>
    </div>
  );
};

export default LogoutPage;

import React from "react";
import logo from "../../assets/atc-primary-logo.png";
import greenCheck from "../../assets/greenCircleCheck.svg";
import styles from "./LogoutPage.module.css";
import { Link } from "react-router-dom";

const LogoutPage: React.FC = () => {
  return (
    <div className={styles["centeredContainer"]}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <img src={greenCheck} alt="Green Check" className={styles.checkmark} />
      <h1 className={styles["logoutText"]}>You have been logged out</h1>

      <Link to="/login">
        <button className={styles["signInButton"]}>Sign in Again</button>
      </Link>
    </div>
  );
};

export default LogoutPage;

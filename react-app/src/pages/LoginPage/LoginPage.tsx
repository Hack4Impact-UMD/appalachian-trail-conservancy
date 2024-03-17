import { Link } from "react-router-dom";
import styles from "./LoginPage.module.css";
import primaryLogo from "../../assets/atc-primary-logo.png";
import { styledButtonGreen, styledButtonWhite } from "../../muiTheme";
import { Button } from "@mui/material";

const styledRectButton = {
  height: 40,
  width: 350,
  marginTop: "5%",
  padding: "1%",
};

function LoginPage() {
  return (
    <>
      <div className={`${styles.split} ${styles.left}`}>
        <div className={styles.leftImgContainer}>
          {/* REPLACE IMAGE */}
          <img
            src={
              "https://mediaproxy.salon.com/width/1200/https://media2.salon.com/2019/07/spongebob-20th.jpg"
            }
          />
        </div>
      </div>
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.centered}>
          <div className={styles.login_input}>
            <div className={styles.rightImgContainer}>
              <img src={primaryLogo} />
            </div>
            {/* welcome label */}
            <h1 className={styles.heading}>Welcome!</h1>
            <Link to="/login/user">
              <Button
                sx={{ ...styledRectButton, ...styledButtonGreen }}
                variant="contained"
              >
                Sign in as user
              </Button>
            </Link>
            <Link to="/login/admin">
              <Button
                sx={{ ...styledRectButton, ...styledButtonWhite }}
                variant="contained"
              >
                Sign in as admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

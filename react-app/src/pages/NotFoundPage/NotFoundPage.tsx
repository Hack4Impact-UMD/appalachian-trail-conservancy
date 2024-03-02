import styles from "./NotFoundPage.module.css";
import primaryLogo from "../../assets/atc-primary-logo.png";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

// back to home button
const styledRectButton = {
    borderRadius: "0px",
    boxShadow: "none",
    width: 350,
    marginTop: "5%",
    padding: "1%",
    fontSize: "18px",
    color: "white",
    backgroundColor: "var(--ocean-green)",
    border: "2px solid var(--ocean-green)",
    "&:hover": {
        backgroundColor: "var(--ocean-green)",
    },
  };

function NotFoundPage () {
    return (<>
    <div className={styles.content}>
        <img src={primaryLogo} className={styles.logoImg} />
        <h1>404</h1>
        <h2>Page not found.</h2>
        <p>The page you are looking for is unavailable or missing.</p>
        <Link to="/">
            <Button sx={styledRectButton}>
                Go back to dashboard
            </Button>
        </Link>
        
    </div>
    </>)
}

export default NotFoundPage
import styles from "./NotFoundPage.module.css";
import primaryLogo from "../../assets/atc-primary-logo.png";
import {Button} from "@mui/material";

function NotFoundPage () {
    return (<>
        <img src={primaryLogo} className={styles.logoImg} />
        <h1>404</h1>
        <h2>Page not found.</h2>
        <p>The page you are looking for is unavailable or missing.</p>
        <Button>Go back to dashboard</Button>
    </>)
}

export default NotFoundPage
import { Button } from "@mui/material";
import { forestGreenButton, whiteButtonGrayBorder } from "../../muiTheme";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import styles from "./QuizPage.module.css";

const styledButtons = {
    marginRight: "10%",
};

function QuizPage() {
    return (
        <div className={styles.bodyContainer}>
            {/* header - title & profile icon */}
            <div className={styles.header}>
                <h1 className={styles.nameHeading}>Training Title - Quiz</h1>
                <ProfileIcon />
            </div>

            {/* footer */}
            <div className={styles.footer}>
                <Button
                sx={{ ...forestGreenButton, ...styledButtons}}
                variant="contained">
                Retake quiz
                </Button>
            </div>
            
        </div>
    );
}

export default QuizPage
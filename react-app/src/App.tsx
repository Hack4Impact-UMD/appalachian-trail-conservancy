import { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar.tsx";
import styles from "./AdminNewUserEmailPage.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon.tsx";
import { IoIosSearch } from "react-icons/io";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Button, TextField, Typography } from "@mui/material";
import { User } from "../../types/UserType.ts";
import Footer from "../../components/Footer/Footer.tsx";

function AdminNewUserEmail() {
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [errors, setErrors] = useState({
    subject: "",
    body: "",
  });

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Edit New User Email</h1>
              <ProfileIcon />
            </div>
            <Typography
              variant="body2"
              style={{
                color: "black",
                fontWeight: "bold",
                marginBottom: "4px",
                marginTop: "2rem",
              }}
            >
              SUBJECT
            </Typography>
            <TextField
              value={subject}
              sx={{
                width: "80%",
                fontSize: "1.1rem",
                borderRadius: "10px",
                marginTop: "0.3rem",
                height: "3.2rem",
                border: "2px solid var(--blue-gray)",
                "& fieldset": {
                  border: "none",
                },
              }}
              onChange={(e) => setSubject(e.target.value)}
              error={Boolean(errors.subject)}
              helperText={errors.subject}
              fullWidth
              margin="normal"
            />
            <Typography
              variant="body2"
              style={{
                color: "black",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              BODY
            </Typography>

            <TextField
              value={body}
              sx={{
                width: "80%",
                fontSize: "1.1rem",
                minHeight: 100,
                borderRadius: "10px",
                marginTop: "0.3rem",
                border: "2px solid var(--blue-gray)",
                "& fieldset": {
                  border: "none",
                },
              }}
              onChange={(e) => setBody(e.target.value)}
              error={Boolean(errors.body)}
              helperText={errors.body}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <div className={styles.buttonContainer}>
              <Button
                variant="outlined"
                color="secondary"
                className={styles.backButton}
              >
                BACK
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                className={styles.saveButton}
              >
                SAVE
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AdminNewUserEmail;

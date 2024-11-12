import { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar.tsx";
import styles from "./AdminNewUserEmailPage.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon.tsx";
import { Button, TextField, Typography } from "@mui/material";
import Footer from "../../components/Footer/Footer.tsx";

function AdminNewUserEmail() {
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [errors, setErrors] = useState({
    subject: "",
    body: "",
  });

  // Helper function to wrap the selected text with a specific HTML tag
  const wrapSelectedText = (tag: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      if (selectedText) {
        const wrapper = document.createElement(tag);
        wrapper.innerText = selectedText;

        range.deleteContents();
        range.insertNode(wrapper);

        setBody(document.getElementById("editableDiv")?.innerHTML || "");
      }
    }
  };
  const handleBodyInput = (event: any) => {
    setBody(event.target.innerHTML);
  };

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

            {/* Container for BODY typography and style buttons */}
            <div className={styles.bodyContainer}>
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

              <div className={styles.styleButtons}>
                <button
                  className={styles.styleButton}
                  onClick={() => wrapSelectedText("b")}
                >
                  <b>B</b>
                </button>
                <button
                  className={styles.styleButton}
                  onClick={() => wrapSelectedText("i")}
                >
                  <i>I</i>
                </button>
                <button
                  className={styles.styleButton}
                  onClick={() => wrapSelectedText("u")}
                >
                  <u>U</u>
                </button>
              </div>
            </div>

            <TextField
              value={body.replace(/<[^>]*>?/gm, "")}
              sx={{
                width: "80%",
                fontSize: "1.1rem",
                minHeight: 250,
                height: "auto",
                borderRadius: "10px",
                marginTop: "0.3rem",
                border: "2px solid var(--blue-gray)",
                "& fieldset": {
                  border: "none",
                },
                "& .MuiInputBase-root": {
                  maxHeight: "250px",
                  overflowY: "auto",
                },
              }}
              onChange={(e) => setBody(e.target.value)}
              error={Boolean(errors.body)}
              helperText={errors.body}
              fullWidth
              multiline
              rows={9}
              margin="normal"
            />

            <div className={styles.buttonContainer}>
              <Button
                variant="outlined"
                color="secondary"
                className={styles.saveButton}
              >
                SAVE
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                className={styles.backButton}
              >
                BACK
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

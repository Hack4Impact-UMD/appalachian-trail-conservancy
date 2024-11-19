import { useState, useRef, useEffect } from "react";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar.tsx";
import styles from "./AdminRegistrationManagementPage.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon.tsx";
import { Button, TextField, Typography } from "@mui/material";
import Footer from "../../components/Footer/Footer.tsx";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import hamburger from "../../assets/hamburger.svg";

function AdminRegistrationManagementPage() {
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({ subject: "", body: "" });

  const editorContainerRef = useRef<HTMLDivElement>(null); // DOM reference for editor container
  const quillRef = useRef<Quill | null>(null); // Quill instance reference

  const toolbarContainer = useRef<HTMLDivElement>(null);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    if (editorContainerRef.current && !quillRef.current) {
      console.log("Initializing Quill editor");
      quillRef.current = new Quill(editorContainerRef.current, {
        modules: {
          toolbar: "#toolbar",
        },
      });

      // Handle Quill text changes
      quillRef.current.on("text-change", () => {
        const editorContent = quillRef.current!.root.innerHTML;
        console.log("Editor content changed:", editorContent);
        setBody(editorContent); // Store as HTML
      });
    }
  }, []); // Empty dependency array ensures this runs only once

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <AdminNavigationBar
        open={navigationBarOpen}
        setOpen={setNavigationBarOpen}
      />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}>
        {!navigationBarOpen && (
          <img
            src={hamburger}
            alt="Hamburger Menu"
            className={styles.hamburger} // Add styles to position it
            width={30}
            onClick={() => setNavigationBarOpen(true)} // Set sidebar open when clicked
          />
        )}
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
              }}>
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
                border: "1px solid var(--blue-gray)",
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

            <div className={styles.bodyContainer}>
              <Typography variant="body2" className={styles.bodyLabel}>
                BODY
              </Typography>

              <div className={styles.toolbarButtons} id="toolbar">
                <button
                  className="ql-bold"
                  style={{
                    background: "none",
                    fontSize: "1.5em",
                    width: "2rem",
                  }}>
                  B
                </button>
                <button
                  className="ql-italic"
                  style={{
                    background: "none",
                    fontSize: "1.5em",
                    width: "2rem",
                  }}>
                  I
                </button>
                <button
                  className="ql-underline"
                  style={{
                    background: "none",
                    fontSize: "1.5em",
                    width: "2rem",
                  }}>
                  U
                </button>
              </div>
            </div>

            {/* Quill Editor Container */}
            <div
              ref={editorContainerRef}
              id="quillEditor"
              style={{
                height: "250px",
                width: "80%",
                border: "1px solid var(--blue-gray)",
                borderRadius: "10px",
                marginBottom: "1rem",
                backgroundColor: "#fff",
              }}></div>

            <div className={styles.buttonContainer}>
              <Button
                variant="outlined"
                color="secondary"
                className={styles.saveButton}
                onClick={() => console.log("Body as HTML:", body)}>
                SAVE
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                className={styles.backButton}>
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

export default AdminRegistrationManagementPage;

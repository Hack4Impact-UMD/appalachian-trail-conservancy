import { useState, useRef, useEffect } from "react";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar.tsx";
import styles from "./AdminRegistrationManagementPage.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon.tsx";
import { Button, TextField, Typography } from "@mui/material";
import Footer from "../../components/Footer/Footer.tsx";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import hamburger from "../../assets/hamburger.svg";
import { updateRegistrationEmail } from "../../backend/AdminFirestoreCalls.ts";
import { EmailType } from "../../types/AssetsType.ts";
import { CustomToggleButtonGroup, PurpleToggleButton } from "../../muiTheme.ts";

function AdminRegistrationManagementPage() {
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [alignment, setAlignment] = useState<string | null>("user");

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({ subject: "", body: "" });

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    if (editorContainerRef.current && !quillRef.current) {
      console.log("Initializing Quill editor");
      quillRef.current = new Quill(editorContainerRef.current, {
        theme: "snow",
        modules: {
          toolbar: [["bold", "italic", "underline", "link"]],
        },
      });

      quillRef.current.on("text-change", () => {
        const editorContent = quillRef.current!.root.innerHTML;
        console.log("Editor content changed:", editorContent);
        setBody(editorContent);
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };
  const handleSave = () => {
    const todayDate = new Date().toISOString().split("T")[0];

    const email: EmailType = {
      subject,
      body,
      type: "EMAIL",
      dateUpdated: todayDate,
    };

    updateRegistrationEmail(email)
      .then(() => {
        console.log("Email updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating email:", error);
      });
  };

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
        }}
      >
        {!navigationBarOpen && (
          <img
            src={hamburger}
            alt="Hamburger Menu"
            className={styles.hamburger}
            width={30}
            onClick={() => setNavigationBarOpen(true)}
          />
        )}
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Registration Management</h1>
              <ProfileIcon />
            </div>
            <div className={styles.buttonGroup}>
              <CustomToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
              >
                <PurpleToggleButton
                  value="user"
                  sx={{
                    fontSize: "0.875rem",
                    padding: "0.5rem 1rem",
                    minWidth: "100px",
                    "&.Mui-selected": {
                      backgroundColor: "lightgray",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "lightgray",
                      },
                    },
                  }}
                >
                  EDIT NEW USER EMAIL
                </PurpleToggleButton>
                <PurpleToggleButton
                  value="registration"
                  sx={{
                    fontSize: "0.875rem",
                    padding: "0.5rem 1rem",
                    minWidth: "100px",
                    "&.Mui-selected": {
                      backgroundColor: "lightgray",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "lightgray",
                      },
                    },
                  }}
                >
                  REGISTRATION CODE
                </PurpleToggleButton>
              </CustomToggleButtonGroup>
            </div>
            {alignment === "user" && (
              <div>
                {" "}
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
                </div>
                {/* Quill Editor Container */}
                <div
                  style={{
                    width: "80%",
                    border: "1px solid black",
                  }}
                >
                  <div
                    ref={editorContainerRef}
                    id="quillEditor"
                    style={{
                      height: "300px",
                    }}
                  ></div>
                </div>
                <div className={styles.buttonContainer}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={styles.saveButton}
                    onClick={handleSave} // Save the email when clicked
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
            )}
            {alignment === "registration" && <p> Registration Code</p>}
          </div>
        </div>{" "}
        <Footer />
      </div>
    </>
  );
}

export default AdminRegistrationManagementPage;

import { useState, useRef, useEffect } from "react";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar.tsx";
import styles from "./AdminRegistrationManagementPage.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon.tsx";
import {
  Button,
  Tooltip,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";
import Footer from "../../components/Footer/Footer.tsx";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import hamburger from "../../assets/hamburger.svg";
import { updateRegistrationEmail } from "../../backend/AdminFirestoreCalls.ts";
import { EmailType } from "../../types/AssetsType.ts";
import {
  CustomToggleButtonGroup,
  PurpleToggleButton,
  forestGreenButton,
  whiteButtonGrayBorder,
  styledRectButton,
} from "../../muiTheme.ts";
import {
  doc,
  getDocs,
  query,
  where,
  collection,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";

function AdminRegistrationManagementPage() {
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [alignment, setAlignment] = useState<string | null>("user");

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({ subject: "", body: "" });

  const [copied, setCopied] = useState(false);
  const [codeText, setCodeText] = useState("XXXXX");
  const [editedCode, setEditedCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);
  const [dateUpdated, setDateUpdated] = useState("");

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

  const handleCopy = () => {
    navigator.clipboard
      .writeText(codeText)
      .then(() => setCopied(true))
      .catch((err) => console.error("Copy failed:", err));

    // Reset tooltip text after a delay
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchRegistrationCode = async () => {
      try {
        const assetsCollection = collection(db, "Assets");
        const querySnapshot = await getDocs(
          query(assetsCollection, where("type", "==", "REGISTRATIONCODE"))
        );

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setCodeText(docData.code);
          setDateUpdated(docData.dateUpdated);
          setDocId(querySnapshot.docs[0].id);
        }
      } catch (err) {
        console.error("Error fetching registration code:", err);
        setCodeText("Error loading registration code.");
      }
    };

    fetchRegistrationCode();
  }, []);

  const handleCodeSave = async () => {
    try {
      if (!docId) {
        throw new Error("Document ID not found. Unable to save changes.");
      }
      setCodeText(editedCode);
      const todayDate = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "Assets", docId);
      await updateDoc(docRef, { code: editedCode, dateUpdated: todayDate });
      console.log("Registration code updated successfully.");
    } catch (err) {
      console.error("Error saving registration code:", err);
    } finally {
      setIsEditing(false); // Exit edit mode after attempting to save
    }
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
        }}>
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
            <div className={styles.mainContainer}>
              <div className={styles.innerMainContainer}>
                <div className={styles.buttonGroup}>
                  <CustomToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}>
                    <PurpleToggleButton
                      value="user"
                      sx={{
                        // padding: "0.75rem 1rem",
                        minWidth: "100px",
                      }}>
                      EDIT NEW USER EMAIL
                    </PurpleToggleButton>
                    <PurpleToggleButton
                      value="registration"
                      sx={{
                        padding: "0.75rem 1rem",
                        minWidth: "100px",
                      }}>
                      REGISTRATION CODE
                    </PurpleToggleButton>
                  </CustomToggleButtonGroup>
                </div>
                <div className={styles.emailRegCodeContainer}>
                  {alignment === "user" && (
                    <div className={styles.emailRegCodeInnerContainer}>
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
                          border: "1px solid black",
                        }}>
                        <div
                          ref={editorContainerRef}
                          id="quillEditor"
                          style={{
                            height: "300px",
                          }}></div>
                      </div>
                      <div className={styles.buttonCodeContainer}>
                        <Button
                          variant="contained"
                          sx={{
                            ...styledRectButton,
                            ...forestGreenButton,
                            width: "120px",
                            marginLeft: "30px",
                          }}
                          onClick={handleSave} // Save the email when clicked
                        >
                          SAVE
                        </Button>
                      </div>
                    </div>
                  )}
                  {alignment === "registration" && (
                    <div className={styles.emailRegCodeInnerContainer}>
                      <Typography
                        variant="body2"
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          marginBottom: "4px",
                          marginTop: "2rem",
                        }}>
                        CURRENT CODE
                      </Typography>
                      {/* Read-only TextField */}
                      <TextField
                        value={isEditing ? editedCode : codeText}
                        onChange={(e) => {
                          if (isEditing) {
                            setEditedCode(e.target.value);
                          }
                        }}
                        sx={{
                          fontSize: "1.1rem",
                          borderRadius: "10px",
                          marginTop: "0.3rem",
                          height: "3.2rem",
                          border: "1px solid var(--blue-gray)",
                          "& fieldset": {
                            border: "none",
                          },
                        }}
                        InputProps={{
                          readOnly: !isEditing,
                          endAdornment: !isEditing && (
                            <Tooltip title={copied ? "Copied!" : "Copy"}>
                              <IconButton
                                onClick={handleCopy}
                                sx={{ color: "black" }}>
                                <ContentCopyIcon />
                              </IconButton>
                            </Tooltip>
                          ),
                        }}
                      />
                      {/* Last Updated Text */}
                      <Typography
                        variant="body2"
                        style={{
                          display: "block",
                          textAlign: "right",
                          marginTop: "1.5rem",
                          color: "gray",
                          alignSelf: "flex-end",
                          width: "80%",
                          gap: "1rem",
                          fontWeight: "bold",
                        }}>
                        Last updated: {dateUpdated || "Unknown"}
                      </Typography>
                      <div className={styles.buttonCodeContainer}>
                        {isEditing ? (
                          <>
                            <Button
                              variant="contained"
                              sx={{
                                ...styledRectButton,
                                ...whiteButtonGrayBorder,
                                width: "120px",
                              }}
                              onClick={() => {
                                setEditedCode(codeText);
                                setIsEditing(false);
                              }}>
                              CANCEL
                            </Button>
                            <Button
                              variant="contained"
                              sx={{
                                ...styledRectButton,
                                ...forestGreenButton,
                                width: "120px",
                                marginLeft: "30px",
                              }}
                              onClick={handleCodeSave} // Save the email when clicked
                            >
                              SAVE
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            sx={{
                              ...styledRectButton,
                              ...whiteButtonGrayBorder,
                              width: "120px",
                            }}
                            onClick={() => {
                              setEditedCode(codeText);
                              setIsEditing(true);
                            }}>
                            EDIT
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div >
    </>
  );
}

export default AdminRegistrationManagementPage;

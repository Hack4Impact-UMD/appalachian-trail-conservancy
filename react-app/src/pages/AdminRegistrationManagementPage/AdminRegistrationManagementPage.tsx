import { useState, useRef, useEffect } from "react";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar.tsx";
import EditEmail from "./SubComponents/EditEmail.tsx";
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
import EditRegistrationCode from "./SubComponents/EditRegistrationCode.tsx";

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
      quillRef.current = new Quill(editorContainerRef.current, {
        theme: "snow",
        modules: {
          toolbar: [["bold", "italic", "underline", "link"]],
        },
      });

      quillRef.current.on("text-change", () => {
        const editorContent = quillRef.current!.root.innerHTML;
        setBody(editorContent);
      });
    }
  }, [alignment]);

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
      quillRef.current = null;
    }
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
            <div className={styles.mainContainer}>
              <div className={styles.innerMainContainer}>
                <div className={styles.buttonGroup}>
                  <CustomToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                  >
                    <PurpleToggleButton
                      value="user"
                      sx={{
                        minWidth: "100px",
                      }}
                    >
                      EDIT NEW USER EMAIL
                    </PurpleToggleButton>
                    <PurpleToggleButton
                      value="registration"
                      sx={{
                        padding: "0.75rem 1rem",
                        minWidth: "100px",
                      }}
                    >
                      REGISTRATION CODE
                    </PurpleToggleButton>
                  </CustomToggleButtonGroup>
                </div>
                <div className={styles.emailRegCodeContainer}>
                  {alignment === "user" && (
                    <EditEmail
                      subject={subject}
                      setSubject={setSubject}
                      body={body}
                      setBody={setBody}
                      editorContainerRef={editorContainerRef}
                    />
                  )}
                  {alignment === "registration" && (
                    <EditRegistrationCode
                      isEditing={isEditing}
                      setIsEditing={setIsEditing}
                      editedCode={editedCode}
                      setEditedCode={setEditedCode}
                      codeText={codeText}
                      setCodeText={setCodeText}
                      copied={copied}
                      setCopied={setCopied}
                      docId={docId}
                      dateUpdated={dateUpdated}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AdminRegistrationManagementPage;

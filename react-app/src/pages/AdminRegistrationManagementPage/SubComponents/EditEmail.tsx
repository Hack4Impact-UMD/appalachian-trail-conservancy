import { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import Loading from "../../../components/LoadingScreen/Loading.tsx";
import { Typography, OutlinedInput, Button } from "@mui/material";
import styles from "./SubComponent.module.css";
import { styledRectButton, forestGreenButton } from "../../../muiTheme.ts";
import { EmailType } from "../../../types/AssetsType.ts";
import {
  getRegistrationEmail,
  updateRegistrationEmail,
} from "../../../backend/AdminFirestoreCalls.ts";

interface EditEmailProps {
  tab: string;
  quillRef: any;
}

function EditEmail({ tab, quillRef }: EditEmailProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRegistrationEmail()
      .then((email) => {
        setSubject(email.subject);
        setLoading(false);
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

          quillRef.current!.root.innerHTML = email.body;
          setBody(email.body);
        }
      })
      .catch((e) => {
        // TODO: Handle error
      });
  }, [tab]);

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
        // TODO: ADD SNACKBAR
        console.log("Email updated successfully!");
      })
      .catch((error) => {
        // TODO: ADD SNACKBAR
        console.error("Error updating email:", error);
      });
  };

  return (
    <>
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.emailRegCodeInnerContainer}>
          <Typography variant="body2" className={styles.subHeaderLabel}>
            SUBJECT
          </Typography>
          <OutlinedInput
            value={subject}
            sx={{
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
            error={true}
          />
          <Typography variant="body2" className={styles.subHeaderLabel}>
            BODY
          </Typography>
          {/* Quill Editor Container */}
          <div
            style={{
              border: "2px solid var(--blue-gray)",
              borderRadius: "10px",
            }}
          >
            <div
              ref={editorContainerRef}
              id={styles.quillEditor}
              style={{
                height: "300px",
              }}
            ></div>
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
    </>
  );
}

export default EditEmail;

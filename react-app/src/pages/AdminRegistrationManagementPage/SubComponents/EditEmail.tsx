import { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import Loading from "../../../components/LoadingScreen/Loading.tsx";
import {
  Typography,
  OutlinedInput,
  Button,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import styles from "./SubComponent.module.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  styledRectButton,
  forestGreenButton,
  grayBorderTextField,
  whiteTooltip,
} from "../../../muiTheme.ts";
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

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [prevEmail, setPrevEmail] = useState<EmailType>({
    subject: "",
    body: "",
    dateUpdated: "",
    type: "EMAIL",
  });
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRegistrationEmail()
      .then((email) => {
        setSubject(email.subject);
        setPrevEmail(email);
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

  const handleEmailSave = () => {
    const todayDate = new Date(Date.now()).toISOString();

    const email: EmailType = {
      subject,
      body,
      type: "EMAIL",
      dateUpdated: todayDate,
    };

    updateRegistrationEmail(email)
      .then(() => {
        //update prev email
        setPrevEmail(email);

        setSnackbarMessage("Email updated successfully");
      })
      .catch((error) => {
        // revert subject and body back to prev email
        quillRef.current!.root.innerHTML = prevEmail.body;
        setBody(prevEmail.body);
        setSubject(prevEmail.subject);

        setSnackbarMessage("Email failed to update");
      })
      .finally(() => {
        setSnackbar(true);
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
              ...grayBorderTextField,
              width: "100%",
            }}
            onChange={(e) => setSubject(e.target.value)}
            error={true}
          />

          <div className={styles.subHeaderLabel}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "var(--blue-gray)" }}
            >
              BODY
            </Typography>
            <Tooltip
              title="When sent, FIRSTNAME will be replaced with the recipient's first name, 
                      and LASTNAME will be replaced with the recipient's last name."
              placement="right"
              componentsProps={{
                tooltip: {
                  sx: {
                    ...whiteTooltip,
                  },
                },
              }}
            >
              <InfoOutlinedIcon />
            </Tooltip>
          </div>

          {/* Quill Editor Container */}
          <div className={styles.quillEditor}>
            <div
              ref={editorContainerRef}
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
              }}
              onClick={handleEmailSave} // Save the email when clicked
            >
              SAVE
            </Button>
          </div>
          {/* Snackbar wrapper container */}
          <div className={styles.snackbarContainer}>
            <Snackbar
              open={snackbar}
              autoHideDuration={6000}
              onClose={() => setSnackbar(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position within the right section
            >
              <Alert
                onClose={() => setSnackbar(false)}
                severity={
                  snackbarMessage.includes("successfully") ? "success" : "error"
                }
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </div>
        </div>
      )}
    </>
  );
}

export default EditEmail;

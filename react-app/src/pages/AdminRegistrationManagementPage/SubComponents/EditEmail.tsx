import { Typography, OutlinedInput, Button } from "@mui/material";
import styles from "./SubComponent.module.css";
import { styledRectButton, forestGreenButton } from "../../../muiTheme.ts";
import { EmailType } from "../../../types/AssetsType.ts";
import { updateRegistrationEmail } from "../../../backend/AdminFirestoreCalls.ts";

interface EditEmailProps {
  subject: string;
  setSubject: any;
  body: string;
  setBody: any;
  editorContainerRef: any;
}

function EditEmail({
  subject,
  setSubject,
  body,
  setBody,
  editorContainerRef,
}: EditEmailProps) {
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
  );
}

export default EditEmail;

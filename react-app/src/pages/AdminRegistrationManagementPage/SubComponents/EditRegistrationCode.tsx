import styles from "./SubComponent.module.css";
import {
  Typography,
  TextField,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";
import {
  forestGreenButton,
  whiteButtonGrayBorder,
  styledRectButton,
} from "../../../muiTheme.ts";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase.ts";

interface EditRegistrationCodeProps {
  isEditing: boolean;
  setIsEditing: any;
  editedCode: string;
  setEditedCode: any;
  codeText: string;
  setCodeText: any;
  copied: boolean;
  setCopied: any;
  docId: any;
  dateUpdated: string;
}

function EditRegistrationCode({
  isEditing,
  setIsEditing,
  editedCode,
  setEditedCode,
  codeText,
  setCodeText,
  copied,
  setCopied,
  docId,
  dateUpdated,
}: EditRegistrationCodeProps) {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(codeText)
      .then(() => setCopied(true))
      .catch((err) => console.error("Copy failed:", err));

    // Reset tooltip text after a delay
    setTimeout(() => setCopied(false), 2000);
  };

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
    <div className={styles.emailRegCodeInnerContainer}>
      <Typography variant="body2" className={styles.subHeaderLabel}>
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
          border: "2px solid var(--blue-gray)",
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
                sx={{ color: "var(--blue-gray)" }}
              >
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
          color: "var(--blue-gray)",
          alignSelf: "flex-end",
          width: "80%",
          gap: "1rem",
          fontWeight: "bold",
        }}
      >
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
              }}
            >
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
            }}
          >
            EDIT
          </Button>
        )}
      </div>
    </div>
  );
}

export default EditRegistrationCode;

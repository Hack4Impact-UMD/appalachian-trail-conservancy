import { useState, useEffect } from "react";
import styles from "./SubComponent.module.css";
import Loading from "../../../components/LoadingScreen/Loading.tsx";
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
import {
  getRegistrationCode,
  updateRegistrationCode,
} from "../../../backend/AdminFirestoreCalls.ts";

function EditRegistrationCode() {
  const [loading, setLoading] = useState<boolean>(true);

  const [copied, setCopied] = useState<boolean>(false);
  const [codeText, setCodeText] = useState<string>("XXXXX");
  const [editedCode, setEditedCode] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [dateUpdated, setDateUpdated] = useState<string>("");

  useEffect(() => {
    getRegistrationCode()
      .then((registratioCode) => {
        setCodeText(registratioCode.code);
        setDateUpdated(registratioCode.dateUpdated);
        setLoading(false);
      })
      .catch((e) => {
        // TODO: handle error
        console.error(e);
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(codeText)
      .then(() => setCopied(true))
      .catch((err) => console.error("Copy failed:", err));

    // Reset tooltip text after a delay
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeSave = async () => {
    setCodeText(editedCode);
    const todayDate = new Date().toISOString().split("T")[0];
    updateRegistrationCode({
      code: editedCode,
      dateUpdated: todayDate,
      type: "REGISTRATIONCODE",
    })
      .then(() => {
        console.log("Registration code updated successfully.");
        setIsEditing(false); // Exit edit mode after attempting to save
      })
      .catch((e) => {
        console.error("Error saving registration code:", e);
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
      )}
    </>
  );
}

export default EditRegistrationCode;

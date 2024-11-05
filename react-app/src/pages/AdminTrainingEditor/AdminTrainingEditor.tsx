import React, { useState, useEffect } from "react";
import styles from "./AdminTrainingEditor.module.css";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  addTraining, 
  updateTraining,
  saveTrainingDraft,
  checkDuplicateTrainingName,
  publishTraining,
  getAllTrainings,
} from "../../backend/FirestoreCalls";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import { LuUpload } from "react-icons/lu";
import { styledRectButton } from "../LoginPage/LoginPage";
import {
  forestGreenButton,
  selectOptionStyle,
  whiteButtonGrayBorder,
} from "../../muiTheme";
import { IoIosInformationCircleOutline } from "react-icons/io";

const AdminTrainingEditor: React.FC = () => {
  const [trainingName, setTrainingName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [description, setDescription] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    trainingName: "",
    blurb: "",
    description: "",
    resourceLink: "",
  });
  const [invalidBlurb, setInvalidBlurb] = useState<boolean>(false);

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const characterLimits = {
    trainingName: 50,
    blurb: 150,
    description: 500,
  };

  const validateFields = () => {
    let newErrors = { ...errors };
    let isValid = true;

    if (!trainingName) {
      newErrors.trainingName = "Training name is required.";
      isValid = false;
    } else if (trainingName.length > characterLimits.trainingName) {
      newErrors.trainingName = `Training name cannot exceed ${characterLimits.trainingName} characters.`;
      isValid = false;
    } else {
      newErrors.trainingName = "";
    }

    if (!blurb) {
      newErrors.blurb = "Blurb is required.";
      isValid = false;
    } else if (blurb.length > characterLimits.blurb) {
      newErrors.blurb = `Blurb cannot exceed ${characterLimits.blurb} characters.`;
      isValid = false;
    } else {
      newErrors.blurb = "";
    }

    if (!description) {
      newErrors.description = "Description is required.";
      isValid = false;
    } else if (description.length > characterLimits.description) {
      newErrors.description = `Description cannot exceed ${characterLimits.description} characters.`;
      isValid = false;
    } else {
      newErrors.description = "";
    }

    const youtubeRegex = /^https:\/\/www\.youtube\.com\/embed\/[\w-]+(\?.*)?$/;
    if (resourceType === "video" && !youtubeRegex.test(resourceLink)) {
      newErrors.resourceLink = "Please provide a valid embedded YouTube link.";
      isValid = false;
    } else {
      newErrors.resourceLink = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextClick = async () => {
    if (validateFields()) {
      console.log("All validations passed");
      const trainingData: Training = {
        name: trainingName,
        shortBlurb: blurb,
        description,
        coverImage: "", // Placeholder, to be filled later
        resources: [
          { 
            link: resourceLink,
            type: resourceType,
            title: trainingName
          },
        ],
        associatedPathways: [], // Placeholder, to be filled later
        quiz: null, // Placeholder, to be filled on quiz page
        status: "DRAFT",
      };
      
      addTraining(trainingData)
        // Make it go to the quiz editor
        .catch((error) => {
          console.error("Error saving draft:", error);
        });
    } else {
      setSnackbarMessage("Please complete all required fields before proceeding.");
      setSnackbar(true);
    }
  };

  const handleSaveDraftClick = async () => {
    const trainingData: Training = {
      name: trainingName,
      shortBlurb: blurb,
      description,
      coverImage: "", // Placeholder, to be filled later
      resources: [
        { 
          link: resourceLink,
          type: resourceType,
          title: trainingName
        },
      ],
      associatedPathways: [], // Placeholder, to be filled later
      quiz: null, // Placeholder, to be filled on quiz page
      status: "DRAFT",
    };
    
    addTraining(trainingData)
      .then(() => {
        setSnackbarMessage("Training Saved As Draft");
        setSnackbar(true);
      })
      .catch((error) => {
        console.error("Error saving draft:", error);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.navbar}>
          <NavigationBar
            open={navigationBarOpen}
            setOpen={setNavigationBarOpen}
          />
        </div>
        <div className={styles.editor}>
          <div className={styles.editorContent}>
            <div className={styles.editorHeader}>
              <h1 className={styles.headerText}>Training Editor</h1>
              <div className={styles.editorProfileHeader}>
                <h5 className={styles.adminText}> Admin </h5>
                <ProfileIcon />
              </div>
            </div>

            <form noValidate>
              <Button sx={whiteButtonGrayBorder} onClick={handleSaveDraftClick}>
                Save as Draft
              </Button>
              <Typography
                variant="body2"
                style={{
                  color: "black",
                  fontWeight: "bold",
                  marginTop: "2rem",
                }}
              >
                TRAINING NAME
              </Typography>
              <TextField
                value={trainingName}
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
                onChange={(e) => setTrainingName(e.target.value)}
                // handleSaveDraft
                error={Boolean(errors.trainingName)}
                helperText={errors.trainingName}
                fullWidth
                margin="normal"
              />

              <Typography
                variant="body2"
                style={{
                  color: "black",
                  fontWeight: "bold",
                  marginTop: "1.2rem",
                }}
              >
                BLURB
              </Typography>
              <TextField
                value={blurb}
                sx={{
                  width: "80%",
                  fontSize: "1.1rem",
                  height: "2rem",
                  minHeight: 100,
                  marginTop: "0.3rem",
                  borderRadius: "10px",
                  border: invalidBlurb
                    ? "2px solid #d32f2f"
                    : "2px solid var(--blue-gray)",
                  "& fieldset": {
                    border: "none",
                  },
                }}
                onChange={(e) => setBlurb(e.target.value)}
                error={Boolean(errors.blurb)}
                helperText={errors.blurb}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              {invalidBlurb && (
                <FormHelperText error>
                  Blurb cannot exceed {characterLimits.blurb} characters.
                </FormHelperText>
              )}

              <Typography
                variant="body2"
                style={{
                  color: "black",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                DESCRIPTION
              </Typography>

              <TextField
                value={description}
                sx={{
                  width: "80%",
                  fontSize: "1.1rem",
                  minHeight: 100,
                  borderRadius: "10px",
                  marginTop: "0.3rem",
                  border: "2px solid var(--blue-gray)",
                  "& fieldset": {
                    border: "none",
                  },
                }}
                onChange={(e) => setDescription(e.target.value)}
                error={Boolean(errors.description)}
                helperText={errors.description}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              <div
                className={styles.uploadSection}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    UPLOAD IMAGE (JPEG, PNG)
                  </Typography>
                  <Tooltip
                    title="Upload will be used as training cover and certificate image"
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: "white",
                          color: "black",
                          borderRadius: "8px",
                          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                        },
                      },
                    }}
                  >
                    <span
                      className={styles.icon}
                      style={{ marginLeft: "8px" }} // Adjust spacing between Typography and Tooltip
                    >
                      <IoIosInformationCircleOutline />
                    </span>
                  </Tooltip>
                </div>

                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    backgroundColor: "#D9D9D9",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#D9D9D9",
                    },
                  }}
                >
                  {/* Increase size of LuUpload icon */}
                  <LuUpload style={{ fontSize: "50px" }} />
                  <input type="file" hidden />
                </Button>
              </div>

              {/* Resource Link and Tooltip */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "2rem",
                }}
              >
                <Typography
                  variant="body2"
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    marginTop: "2rem",
                  }}
                >
                  RESOURCE LINK
                </Typography>

                <Tooltip
                  title="Should be link to PDF or Video"
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "white",
                        color: "black",
                        borderRadius: "8px",
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                      },
                    },
                  }}
                >
                  <span
                    className={styles.icon}
                    style={{ marginTop: "1.75rem" }}
                  >
                    <IoIosInformationCircleOutline />
                  </span>
                </Tooltip>
              </div>

              <div className={styles.flexRow}>
                <TextField
                  value={resourceLink}
                  sx={{
                    width: "50vw",
                    height: "3.5rem",
                    fontSize: "1.1rem",

                    borderRadius: "10px",

                    marginRight: "1rem",
                    border: "2px solid var(--blue-gray)",
                    "& fieldset": {
                      border: "none",
                    },
                    "& .MuiInputBase-root": {
                      padding: "0.5rem 1rem",
                      display: "flex",
                      alignItems: "center",
                    },
                  }}
                  onChange={(e) => setResourceLink(e.target.value)}
                  error={Boolean(errors.resourceLink)}
                  helperText={errors.resourceLink}
                  fullWidth
                  margin="normal"
                  className={styles.resourceLinkField}
                  style={{ marginTop: "0px" }}
                />

                <FormControl
                  margin="normal"
                  className={styles.resourceTypeField}
                >
                  <Typography
                    variant="body2"
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      marginTop: "-2.5rem",
                    }}
                  >
                    RESOURCE TYPE
                  </Typography>
                  <Select
                    value={resourceType}
                    displayEmpty
                    sx={{
                      height: "3.5rem",
                      fontSize: "1.1rem",
                      borderRadius: "10px",
                      padding: "0.5rem 1rem",
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        color: resourceType === "" ? "gray" : "black",
                      },
                    }}
                    onChange={(e) => setResourceType(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          "& .MuiMenuItem-root:hover": {
                            backgroundColor: "var(--ocean-green)",
                            color: "white",
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="pdf" sx={selectOptionStyle}>
                      PDF
                    </MenuItem>
                    <MenuItem value="video" sx={selectOptionStyle}>
                      Video
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Button group */}
              <div className={styles.addTrainingContainer}>
                <Button
                  variant="contained"
                  sx={{
                    ...styledRectButton,
                    ...forestGreenButton,
                    marginTop: "2%",
                    width: "40px%",
                  }}
                  onClick={handleNextClick}
                >
                  Next: Create Quiz
                </Button>
              </div>
            </form>
          </div>
          {/* Snackbar for Feedback */}
          <Snackbar open={snackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes("Draft") ? "success" : "error"}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <Footer />{" "}
        </div>
      </div>
    </>
  );
};

export default AdminTrainingEditor;

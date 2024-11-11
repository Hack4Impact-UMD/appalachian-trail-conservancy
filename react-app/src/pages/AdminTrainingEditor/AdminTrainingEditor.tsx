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
  whiteSelectGrayBorder,
} from "../../muiTheme";
import { IoIosInformationCircleOutline } from "react-icons/io";
import hamburger from "../../assets/hamburger.svg";

const AdminTrainingEditor: React.FC = () => {
  const [trainingName, setTrainingName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [description, setDescription] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [errors, setErrors] = useState({
    trainingName: "",
    blurb: "",
    description: "",
    resourceLink: "",
  });

  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidBlurb, setInvalidBlurb] = useState<boolean>(false);
  const [invalidDescription, setInvalidDescription] = useState<boolean>(false);

  const characterLimits = {
    trainingName: 2,
    blurb: 5,
    description: 10,
  };

  // make sure all fields are good before moving on
  const validateFields = () => {
    let newErrors = {
      trainingName: "",
      blurb: "",
      description: "",
      resourceLink: "",
    };
    let isValid = true;

    // Check for required fields
    if (!trainingName) {
      newErrors.trainingName = "Training name is required.";
      isValid = false;
    }

    if (!blurb) {
      newErrors.blurb = "Blurb is required.";
      isValid = false;
    }

    if (!description) {
      newErrors.description = "Description is required.";
      isValid = false;
    }

    // Validate Resource Link if type is video
    const youtubeRegex = /^https:\/\/www\.youtube\.com\/embed\/[\w-]+(\?.*)?$/;
    if (resourceType === "video" && !youtubeRegex.test(resourceLink)) {
      newErrors.resourceLink = "Please provide a valid embedded YouTube link.";
      isValid = false;
    } else if (resourceType && !resourceLink) {
      newErrors.resourceLink = "Resource link is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextClick = async () => {
    if (validateFields()) {
      console.log("All validations passed");
      // save training and proceed to quiz editor
      const trainingData: Training = {
        name: trainingName,
        shortBlurb: blurb,
        description: description,
        coverImage: '', // Placeholder, to be filled later
        resources: [
          {
            link: resourceLink,
            type: resourceType,
            title: "",
          },
        ],
        associatedPathways: [], // Placeholder, to be filled later
        quiz: null, // Placeholder, to be filled on quiz page
        status: "DRAFT",
      };

      try {
        await addTraining(trainingData);
        // navigate(`/quiz-creation/${trainingData.name}`); // Adjust the route to match quiz editor
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    } else {
      setSnackbarMessage(
        "Please complete all required fields before proceeding."
      );
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
          title: trainingName,
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
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />

      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
        {/* Hamburger Menu */}
        {!navigationBarOpen && (
          <img
            src={hamburger}
            alt="Hamburger Menu"
            className={styles.hamburger} // Add styles to position it
            width={30}
            onClick={() => setNavigationBarOpen(true)} // Set sidebar open when clicked
          />
        )}

        <div className={styles.container}>
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
                <Button
                  sx={whiteButtonGrayBorder}
                  onClick={handleSaveDraftClick}
                >
                  Save as Draft
                </Button>

                <div className={styles.inputBoxHeader}>
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

                  <Typography
                    variant="body2"
                    style={{
                      color: "black",
                      fontWeight: "500",
                      marginTop: "2rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    {Math.max(
                      characterLimits.trainingName - trainingName.length,
                      0
                    )}{" "}
                    Characters Remaining
                  </Typography>
                </div>

                <TextField
                  value={trainingName}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length <= characterLimits.trainingName) {
                      setTrainingName(newValue);
                    }
                  }}
                  error={Boolean(errors.trainingName)}
                  helperText={errors.trainingName}
                  sx={{
                    width: "80%",
                    fontSize: "1.1rem",
                    borderRadius: "10px",
                    marginTop: "0.3rem",
                    height: "3.2rem",
                    border: errors.trainingName
                      ? "2px solid #d32f2f"
                      : "2px solid var(--blue-gray)",
                    "& fieldset": {
                      border: "none",
                    },
                  }}
                  variant="outlined"
                  rows={1}
                  fullWidth
                />

                <div className={styles.inputBoxHeader}>
                  <Typography
                    variant="body2"
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      marginTop: "2rem",
                    }}
                  >
                    BLURB
                  </Typography>

                  <Typography
                    variant="body2"
                    style={{
                      color: "black",
                      fontWeight: "500",
                      marginTop: "2rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    {Math.max(characterLimits.blurb - blurb.length, 0)}{" "}
                    Characters Remaining
                  </Typography>
                </div>

                <TextField
                  value={blurb}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length <= characterLimits.blurb) {
                      setBlurb(newValue);
                    }
                  }}
                  error={Boolean(errors.blurb)}
                  helperText={errors.blurb}
                  sx={{
                    width: "80%",
                    fontSize: "1.1rem",
                    height: "auto",
                    minHeight: 100,
                    marginTop: "0.3rem",
                    borderRadius: "10px",
                    border: errors.blurb
                      ? "2px solid #d32f2f"
                      : "2px solid var(--blue-gray)",
                    "& fieldset": {
                      border: "none",
                    },
                  }}
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
                />

                <div className={styles.inputBoxHeader}>
                  <Typography
                    variant="body2"
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      marginTop: "2rem",
                    }}
                  >
                    DESCRIPTION
                  </Typography>

                  <Typography
                    variant="body2"
                    style={{
                      color: "black",
                      fontWeight: "500",
                      marginTop: "2rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    {Math.max(
                      characterLimits.description - description.length,
                      0
                    )}{" "}
                    Characters Remaining
                  </Typography>
                </div>

                <TextField
                  value={description}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length <= characterLimits.description) {
                      setDescription(newValue);
                    }
                  }}
                  error={Boolean(errors.description)}
                  helperText={errors.description}
                  sx={{
                    width: "80%",
                    fontSize: "1.1rem",
                    minHeight: 100,
                    borderRadius: "10px",
                    marginTop: "0.3rem",
                    border: errors.description
                      ? "2px solid #d32f2f"
                      : "2px solid var(--blue-gray)",
                    "& fieldset": {
                      border: "none",
                    },
                  }}
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
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
                        style={{ marginLeft: "8px" }}
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
                    <LuUpload style={{ fontSize: "50px" }} />
                    <input type="file" hidden />
                  </Button>
                </div>

                {/* Resource Link and Tooltip */}
                <div className={styles.resourceHeadersBox}>
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
                        style={{ marginLeft: "8px", marginBottom: "0.5rem" }}
                      >
                        <IoIosInformationCircleOutline />
                      </span>
                    </Tooltip>
                  </div>
                </div>
                <div className={styles.flexRow}>
                  <TextField
                    value={resourceLink}
                    sx={{
                      width: "70%",
                      fontSize: "1.1rem",
                      borderRadius: "10px",
                      marginTop: "0.3rem",
                      height: "3.2rem",
                      border: "2px solid var(--blue-gray)",
                      "& fieldset": {
                        border: "none",
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
                    sx={{ marginTop: "0px" }}
                    className={styles.resourceTypeField}
                  >
                    <Select
                      className={styles.dropdownMenu}
                      sx={{
                        ...whiteSelectGrayBorder,
                        fontSize: "1.1rem",
                        borderRadius: "10px",
                        height: "3.2rem",
                        width: "180px",
                      }}
                      value={resourceType}
                      onChange={(e) => setResourceType(e.target.value)}
                      displayEmpty
                      label="Resource Type"
                    >
                      <MenuItem value="" disabled sx={{ display: "none" }}>
                        Resource Type
                      </MenuItem>
                      <MenuItem value="all">PDF</MenuItem>
                      <MenuItem value="inProgress">Video</MenuItem>
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
            {
              <Snackbar
                open={snackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity={
                    snackbarMessage.includes("Draft") ? "success" : "error"
                  }
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            }
            <Footer />{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTrainingEditor;

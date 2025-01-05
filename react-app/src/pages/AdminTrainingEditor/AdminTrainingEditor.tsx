import React, { useState, useEffect } from "react";
import styles from "./AdminTrainingEditor.module.css";
import { useNavigate, useLocation } from "react-router-dom";
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
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import {
  addTraining,
  updateTraining,
  getAllTrainings,
} from "../../backend/FirestoreCalls";
import {
  TrainingID,
  Training,
  TrainingResource,
  Resource,
  Quiz,
  Question,
  Status,
} from "../../types/TrainingType";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import { LuUpload } from "react-icons/lu";
import { styledRectButton } from "../../muiTheme";
import {
  forestGreenButton,
  whiteButtonGrayBorder,
  whiteSelectGrayBorder,
} from "../../muiTheme";
import { IoIosInformationCircleOutline } from "react-icons/io";
import hamburger from "../../assets/hamburger.svg";
import { storage } from "../../config/firebase";

const AdminTrainingEditor: React.FC = () => {
  const location = useLocation();
  const trainingData = location.state?.training as TrainingID | undefined;

  const [trainingId, setTrainingId] = useState<string | undefined>(
    trainingData?.id
  );
  const [trainingName, setTrainingName] = useState(trainingData?.name || "");
  const [blurb, setBlurb] = useState(trainingData?.shortBlurb || "");
  const [description, setDescription] = useState(
    trainingData?.description || ""
  );
  const [resourceLink, setResourceLink] = useState(
    trainingData?.resources[0]?.link || ""
  );
  const [resourceType, setResourceType] = useState(
    trainingData?.resources[0]?.type || ""
  );

  const [coverImage, setCoverImage] = useState(
    trainingData?.coverImage || null
  );

  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [status, setStatus] = useState(trainingData?.status || "DRAFT");

  const [isEditMode, setIsEditMode] = useState<boolean>(status !== "DRAFT");

  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [errors, setErrors] = useState({
    trainingName: "",
    blurb: "",
    description: "",
    resourceLink: "",
    resourceType: "",
  });

  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidBlurb, setInvalidBlurb] = useState<boolean>(false);
  const [invalidDescription, setInvalidDescription] = useState<boolean>(false);

  const characterLimits = {
    trainingName: 50,
    blurb: 500,
    description: 1000,
  };

  // const [file, setFile] = useState<File | null>(null);

  const onUpload = async (file: File) => {
    if (!file) {
      setSnackbarMessage("No file found. Please try again.");
      setSnackbar(true);
      return;
    }

    console.log("File selected:", file.name);

    const fileExtension = file.name.split(".").pop();
    // Upload file to firebase storage
    try {
      const randomName = crypto.randomUUID();

      const storageRef = ref(storage, `${randomName}.${fileExtension}`);

      const fileContent = await file.arrayBuffer();

      console.log("Uploading file to Firebase Storage...");
      await uploadBytes(storageRef, fileContent);
      console.log("File uploaded to Firebase Storage");
      const downloadURL = await getDownloadURL(storageRef);

      setCoverImage(downloadURL);
      setSnackbarMessage("Image uploaded successfully.");
      setSnackbar(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      setSnackbarMessage("Failed to upload image. Please try again.");
      setSnackbar(true);
    }
  };

  const handleDelete = async () => {
    if (!coverImage) return;

    try {
      const fileRef = ref(storage, coverImage);

      // Delete the file from Firebase Storage
      await deleteObject(fileRef);
      setCoverImage(null);

      setSnackbarMessage("Image deleted successfully.");
      setSnackbar(true);
    } catch (error) {
      console.error("Error deleting file:", error);
      setSnackbarMessage("Failed to delete image. Please try again.");
      setSnackbar(true);
    }
  };

  // make sure all fields are good before moving on
  const validateFields = () => {
    let newErrors = {
      trainingName: "",
      blurb: "",
      description: "",
      resourceLink: "",
      resourceType: "",
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

    if (!resourceType) {
      newErrors.resourceType = "Resource Type is required.";
      isValid = false;
    }

    // Validate Resource Link if type is video
    const youtubeRegex = /^https:\/\/www\.youtube\.com\/embed\/[\w-]+(\?.*)?$/;
    if (resourceType === "VIDEO" && !youtubeRegex.test(resourceLink)) {
      newErrors.resourceLink = "Please provide a valid embedded YouTube link.";
      isValid = false;
    } else if (resourceType && !resourceLink) {
      newErrors.resourceLink = "Resource link is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveClick = async () => {
    // Validate fields only if in edit mode
    if (isEditMode && !validateFields()) {
      setSnackbarMessage("Please complete all required fields.");
      setSnackbar(true);
      return;
    }

    let blankErrors = {
      trainingName: "",
      blurb: "",
      description: "",
      resourceLink: "",
      resourceType: "",
    };
    setErrors(blankErrors);

    const updatedTraining = {
      name: trainingName,
      shortBlurb: blurb,
      description: description,
      coverImage: coverImage,
      resources: [
        { link: resourceLink, type: resourceType } as TrainingResource,
      ],
      status: isEditMode ? status : "DRAFT",
    } as Training;

    if (trainingId) {
      // Update existing training
      await updateTraining(updatedTraining, trainingId);
      setSnackbarMessage("Training updated successfully.");
    } else {
      // Save as new draft
      const newTrainingId = (await addTraining(updatedTraining)) as
        | string
        | undefined;
      setTrainingId(newTrainingId);
      setSnackbarMessage("Draft saved successfully.");
    }
    setSnackbar(true);
  };

  const handleNextClick = async () => {
    if (validateFields()) {
      const updatedTraining = {
        ...trainingData,
        name: trainingName,
        shortBlurb: blurb,
        description: description,
        coverImage: coverImage,
        resources: [
          {
            link: resourceLink,
            type: resourceType as Resource,
          } as TrainingResource,
        ] as TrainingResource[],
        status: isEditMode ? status : ("DRAFT" as Status),
      } as TrainingID;

      if (trainingId) {
        await updateTraining(updatedTraining, trainingId);
        updatedTraining.id = trainingId;
        setSnackbarMessage("Training updated successfully.");
        setSnackbar(true);

        // Navigate to the quiz editor with the training as state
        navigate("/trainings/editor/quiz", {
          state: { training: updatedTraining },
        });
      } else {
        const newTrainingId = await addTraining(updatedTraining);
        updatedTraining.id = newTrainingId;
        setSnackbarMessage("Draft saved successfully.");
        setSnackbar(true);

        // Navigate to the quiz editor with the new training as state
        navigate("/trainings/editor/quiz", {
          state: { training: updatedTraining },
        });
      }
    } else {
      setSnackbarMessage("Please complete all required fields.");
      setSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  };

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />

      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}>
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
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.headerText}>Training Editor</h1>
              <ProfileIcon />
            </div>

            <form noValidate>
              <Button
                sx={whiteButtonGrayBorder}
                variant="contained"
                onClick={handleSaveClick}>
                {isEditMode ? "Save" : "Save as Draft"}
              </Button>

              <div className={styles.inputBoxHeader}>
                <Typography
                  variant="body2"
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    marginTop: "2rem",
                  }}>
                  TRAINING NAME
                </Typography>

                <Typography
                  variant="body2"
                  style={{
                    color: "black",
                    fontWeight: "500",
                    marginTop: "2rem",
                    fontSize: "0.8rem",
                  }}>
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
                  }}>
                  BLURB
                </Typography>

                <Typography
                  variant="body2"
                  style={{
                    color: "black",
                    fontWeight: "500",
                    marginTop: "2rem",
                    fontSize: "0.8rem",
                  }}>
                  {Math.max(characterLimits.blurb - blurb.length, 0)} Characters
                  Remaining
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
                  }}>
                  DESCRIPTION
                </Typography>

                <Typography
                  variant="body2"
                  style={{
                    color: "black",
                    fontWeight: "500",
                    marginTop: "2rem",
                    fontSize: "0.8rem",
                  }}>
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
                }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}>
                  <Typography
                    variant="body2"
                    style={{
                      color: "black",
                      fontWeight: "bold",
                    }}>
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
                    }}>
                    <span className={styles.icon} style={{ marginLeft: "8px" }}>
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
                  }}>
                  <LuUpload style={{ fontSize: "50px" }} />
                  <input
                    type="file"
                    id="upload"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const selectedFile = e.target.files[0];
                        // setFile(selectedFile); // Update the file state
                        await onUpload(selectedFile); // Call onUpload directly after file selection
                      }
                    }}
                  />
                </Button>
                {coverImage && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      style={{
                        width: "100px",
                        height: "auto",
                        marginRight: "10px",
                      }}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleDelete}
                      sx={{ marginTop: "10px" }}>
                      Delete Image
                    </Button>
                  </div>
                )}
              </div>

              {/* Resource Link and Tooltip */}
              <div className={styles.resourceHeadersBox}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "2rem",
                  }}>
                  <Typography
                    variant="body2"
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                    }}>
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
                    }}>
                    <span style={{ marginLeft: "8px", marginBottom: "0.5rem" }}>
                      <IoIosInformationCircleOutline />
                    </span>
                  </Tooltip>
                </div>
              </div>
              <div className={styles.flexRow}>
                <TextField
                  value={resourceLink}
                  sx={{
                    width: "65.5%",
                    fontSize: "1.1rem",
                    borderRadius: "10px",
                    marginTop: "0.3rem",
                    height: "3.2rem",
                    border: errors.resourceLink
                      ? "2px solid #d32f2f"
                      : "2px solid var(--blue-gray)",
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
                  sx={{ marginTop: "0px", width: "180px" }}
                  className={styles.resourceTypeField}
                  error={Boolean(errors.resourceType)}>
                  <Select
                    className={styles.dropdownMenu}
                    sx={{
                      ...whiteSelectGrayBorder,
                      fontSize: "1.1rem",
                      borderRadius: "10px",
                      height: "3.2rem",
                    }}
                    value={resourceType}
                    onChange={(e) =>
                      setResourceType(
                        e.target.value === "VIDEO" ? "VIDEO" : "PDF"
                      )
                    }
                    displayEmpty
                    label="Resource Type"
                    renderValue={(selected) => {
                      if (selected === "") {
                        return <em>Resource Type</em>;
                      }
                      return selected === "VIDEO" ? "Video" : "PDF";
                    }}>
                    <MenuItem value="" disabled sx={{ display: "none" }}>
                      Resource Type
                    </MenuItem>
                    <MenuItem value="PDF">PDF</MenuItem>
                    <MenuItem value="VIDEO">Video</MenuItem>
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
                  onClick={handleNextClick}>
                  {isEditMode ? "Next: Edit Quiz" : "Next: Create Quiz"}
                </Button>
              </div>
            </form>
          </div>
          {/* Snackbar wrapper container */}
          <div className={styles.snackbarContainer}>
            <Snackbar
              open={snackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position within the right section
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={
                  snackbarMessage.includes("successfully") ? "success" : "error"
                }>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AdminTrainingEditor;

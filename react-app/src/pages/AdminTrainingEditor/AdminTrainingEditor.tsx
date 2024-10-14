import React, { useState } from "react";
import styles from "./AdminTrainingEditor.module.css";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Typography,
} from "@mui/material";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

const AdminTrainingEditor: React.FC = () => {
  const [trainingName, setTrainingName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [description, setDescription] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);

  const [errors, setErrors] = useState({
    trainingName: "",
    blurb: "",
    description: "",
    resourceLink: "",
  });

  const characterLimits = {
    trainingName: 50,
    blurb: 150,
    description: 500,
  };

  const validateFields = () => {
    let newErrors = { ...errors };

    if (trainingName.length > characterLimits.trainingName) {
      newErrors.trainingName = `Training name cannot exceed ${characterLimits.trainingName} characters.`;
    } else {
      newErrors.trainingName = "";
    }

    if (blurb.length > characterLimits.blurb) {
      newErrors.blurb = `Blurb cannot exceed ${characterLimits.blurb} characters.`;
    } else {
      newErrors.blurb = "";
    }

    if (description.length > characterLimits.description) {
      newErrors.description = `Description cannot exceed ${characterLimits.description} characters.`;
    } else {
      newErrors.description = "";
    }

    const youtubeRegex = /^https:\/\/www\.youtube\.com\/embed\/[\w-]+(\?.*)?$/;
    if (resourceType === "video" && !youtubeRegex.test(resourceLink)) {
      newErrors.resourceLink = "Please provide a valid embedded YouTube link.";
    } else {
      newErrors.resourceLink = "";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleNextClick = () => {
    if (validateFields()) {
      console.log("All validations passed");
    }
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
              <ProfileIcon />
            </div>

            <form noValidate>
              <Button
                variant="outlined"
                color="secondary"
                className={styles.saveButton}
              >
                Save as Draft
              </Button>
              <Typography
                variant="body2"
                style={{
                  color: "black",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                TRAINING NAME
              </Typography>
              <TextField
                value={trainingName}
                onChange={(e) => setTrainingName(e.target.value)}
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
                  marginBottom: "4px",
                }}
              >
                BLURB
              </Typography>
              <TextField
                value={blurb}
                onChange={(e) => setBlurb(e.target.value)}
                error={Boolean(errors.blurb)}
                helperText={errors.blurb}
                fullWidth
                margin="normal"
              />

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
                onChange={(e) => setDescription(e.target.value)}
                error={Boolean(errors.description)}
                helperText={errors.description}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              {/* Upload Section */}
              <div className={styles.uploadSection}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ backgroundColor: "#007bff", color: "white" }} // Change colors here
                >
                  Upload Image
                  <input type="file" hidden />
                </Button>
              </div>

              {/* Flex row for Resource Link and Resource Type */}
              <Typography
                variant="body2"
                style={{
                  color: "black",
                  fontWeight: "bold",
                  marginBottom: "2px",
                }}
              >
                RESOURCE LINK (PDF or Video)
              </Typography>
              <div className={styles.flexRow}>
                <TextField
                  value={resourceLink}
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
                  <InputLabel>Resource Type</InputLabel>
                  <Select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Button group */}
              <div className={styles.buttonGroup}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#49A772", color: "white" }} // Change background color and text color
                  onClick={handleNextClick}
                >
                  Next
                </Button>
              </div>
            </form>
          </div>
          <Footer />{" "}
        </div>
      </div>
      {/* Make sure the footer is styled to be full width in its own CSS */}
    </>
  );
};

export default AdminTrainingEditor;

import React, { useState } from "react";
import styles from "./AdminTrainingEditor.module.css"; // Assuming CSS file is here
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import NavigationBar from "../../components/NavigationBar/NavigationBar";

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
    trainingName: 50, // Adjustable
    blurb: 150, // Adjustable
    description: 500, // Adjustable
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

    // Regex for YouTube embedded link
    const youtubeRegex = /^https:\/\/www\.youtube\.com\/embed\/[\w-]+$/;
    if (resourceType === "video" && !youtubeRegex.test(resourceLink)) {
      newErrors.resourceLink = "Please provide a valid embedded YouTube link.";
    } else {
      newErrors.resourceLink = "";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleNextClick = () => {
    if (validateFields()) {
      // Proceed to the next step
      console.log("All validations passed");
    }
  };

  return (
    <div className={styles.container}>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div className={styles.editor}>
        <h1>Training Editor</h1>
        <form noValidate>
          <TextField
            label="Training Name"
            value={trainingName}
            onChange={(e) => setTrainingName(e.target.value)}
            error={Boolean(errors.trainingName)}
            helperText={errors.trainingName}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Blurb"
            value={blurb}
            onChange={(e) => setBlurb(e.target.value)}
            error={Boolean(errors.blurb)}
            helperText={errors.blurb}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={Boolean(errors.description)}
            helperText={errors.description}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <div className={styles.uploadSection}>
            <Button variant="contained" component="label">
              Upload Image
              <input type="file" hidden />
            </Button>
          </div>
          <TextField
            label="Resource Link (PDF or Video)"
            value={resourceLink}
            onChange={(e) => setResourceLink(e.target.value)}
            error={Boolean(errors.resourceLink)}
            helperText={errors.resourceLink}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Resource Type</InputLabel>
            <Select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="video">Video</MenuItem>
            </Select>
            <FormHelperText>Select the type of resource</FormHelperText>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleNextClick}>
            Next
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className={styles.saveButton}
          >
            Save as Draft
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminTrainingEditor;

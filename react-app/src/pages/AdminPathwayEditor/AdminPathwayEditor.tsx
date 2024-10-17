import React, { ChangeEvent, useState } from "react";
import styles from "./AdminPathwayEditor.module.css";
import InfoIcon from "@mui/icons-material/Info";

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
  InputAdornment,
  OutlinedInput,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import { LuUpload } from "react-icons/lu";
import {
  forestGreenButton,
  grayBorderSearchBar,
  whiteButtonGrayBorder,
  whiteButtonGreenBorder,
} from "../../muiTheme";
import { IoIosSearch } from "react-icons/io";
import { styledRectButton } from "../LoginPage/LoginPage";

const AdminPathwayEditor: React.FC = () => {
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

  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidBlurb, setInvalidBlurb] = useState<boolean>(false);
  const [invalidDescription, setInvalidDescription] = useState<boolean>(false);

  const options = ["blah", "blah blah"];

  const characterLimits = {
    trainingName: 2,
    blurb: 5,
    description: 10,
  };

  const validateFields = () => {
    let newErrors = { ...errors };

    if (trainingName.length > characterLimits.trainingName) {
      setInvalidName(true);
      newErrors.trainingName = `Training name cannot exceed ${characterLimits.trainingName} characters.`;
    } else {
      newErrors.trainingName = "";
      setInvalidName(false);
    }

    if (blurb.length > characterLimits.blurb) {
      newErrors.blurb = `Blurb cannot exceed ${characterLimits.blurb} characters.`;
      setInvalidBlurb(true);
    } else {
      newErrors.blurb = "";
      setInvalidBlurb(false);
    }

    if (description.length > characterLimits.description) {
      newErrors.description = `Description cannot exceed ${characterLimits.description} characters.`;
      setInvalidDescription(true);
    } else {
      newErrors.description = "";
      setInvalidDescription(false);
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

  function debouncedOnChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    throw new Error("Function not implemented.");
  }

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
              <h1 className={styles.nameHeading}>Pathways Editor</h1>
              <div className={styles.editorProfileHeader}>
                <h5 className={styles.adminText}> Admin </h5>
                <ProfileIcon />
              </div>
            </div>

            <form noValidate>
              <Button sx={whiteButtonGrayBorder}>Save as Draft</Button>
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
                  border: invalidName
                    ? "2px solid #d32f2f"
                    : "2px solid var(--blue-gray)",
                  "& fieldset": {
                    border: "none",
                  },
                }}
                onChange={(e) => setTrainingName(e.target.value)}
                variant="outlined"
                rows={1}
                fullWidth
              />
              {invalidName && (
                <FormHelperText error>
                  Training name cannot exceed {characterLimits.trainingName}{" "}
                  characters.
                </FormHelperText>
              )}

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
              <TextField
                value={blurb}
                sx={{
                  width: "80%",
                  fontSize: "1.1rem",
                  height: "auto",
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
                multiline
                rows={3}
                variant="outlined"
                fullWidth
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
                  marginTop: "2rem",
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
                  border: invalidDescription
                    ? "2px solid #d32f2f"
                    : "2px solid var(--blue-gray)",
                  "& fieldset": {
                    border: "none",
                  },
                }}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                variant="outlined"
                fullWidth
              />

              {invalidDescription && (
                <FormHelperText error>
                  Description cannot exceed {characterLimits.description}{" "}
                  characters.
                </FormHelperText>
              )}

              {/* Upload Section with Typography and LuUpload Icon */}
              <div
                className={styles.uploadSection}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="body2"
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  UPLOAD IMAGE (JPEG, PNG)
                </Typography>
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
                }}
              >
                <div className={styles.trainingSelection}>
                  <Typography
                    variant="body2"
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      marginTop: "2rem",
                    }}
                  >
                    TRAINING SELECT
                  </Typography>

                  <div className={styles.searchBarsBox}>
                    <div className={styles.searchBarContainer}>
                      <p className={styles.searchBarNumber}>1</p>
                      <Autocomplete
                        disablePortal
                        options={options}
                        sx={{
                          ...grayBorderSearchBar,
                          width: "1000%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="SEARCH"
                            InputLabelProps={{
                              shrink: false,
                            }}
                            sx={{
                              "& .MuiInputLabel-root": {
                                color: "var(--blue-gray)",
                                opacity: "50%",
                                paddingBottom: "18%",
                                "&.Mui-focused": {
                                  visibility: "hidden",
                                },
                              },
                              "& .MuiOutlinedInput-root": {
                                padding: "8px",
                                display: "flex",
                                alignItems: "center",
                              },
                            }}
                            className="custom-text-field"
                          />
                        )}
                      />

                      <div
                        className={styles.searchBarX}
                        style={{ visibility: "hidden" }}
                      >
                        <CloseIcon></CloseIcon>
                      </div>
                    </div>
                    <div className={styles.searchBarContainer}>
                      <p className={styles.searchBarNumber}>2</p>
                      <Autocomplete
                        disablePortal
                        options={options}
                        sx={{
                          ...grayBorderSearchBar,
                          width: "600%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="SEARCH"
                            InputLabelProps={{
                              shrink: false,
                            }}
                            sx={{
                              "& .MuiInputLabel-root": {
                                color: "var(--blue-gray)",
                                opacity: "50%",
                                paddingBottom: "18%",
                                "&.Mui-focused": {
                                  visibility: "hidden",
                                },
                              },
                              "& .MuiOutlinedInput-root": {
                                padding: "8px",
                                display: "flex",
                                alignItems: "center",
                              },
                            }}
                            className="custom-text-field"
                          />
                        )}
                      />
                      <div className={styles.searchBarX}>
                        <CloseIcon></CloseIcon>
                      </div>
                    </div>
                    <div className={styles.searchBarContainer}>
                      <p className={styles.searchBarNumber}>3</p>
                      <Autocomplete
                        disablePortal
                        options={options}
                        sx={{
                          ...grayBorderSearchBar,
                          width: "600%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="SEARCH"
                            InputLabelProps={{
                              shrink: false,
                            }}
                            sx={{
                              "& .MuiInputLabel-root": {
                                color: "var(--blue-gray)",
                                opacity: "50%",
                                paddingBottom: "18%",
                                "&.Mui-focused": {
                                  visibility: "hidden",
                                },
                              },
                              "& .MuiOutlinedInput-root": {
                                padding: "8px",
                                display: "flex",
                                alignItems: "center",
                              },
                            }}
                            className="custom-text-field"
                          />
                        )}
                      />
                      <div className={styles.searchBarX}>
                        <CloseIcon></CloseIcon>
                      </div>
                    </div>
                    <div className={styles.addTrainingContainer}>
                      <p
                        className={styles.searchBarNumber}
                        style={{ visibility: "hidden" }}
                      >
                        4
                      </p>
                      <Button
                        sx={{ ...whiteButtonGrayBorder, textAlign: "left" }}
                      >
                        Add Training
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Button group */}
              <div className={styles.addTrainingContainer}> 
                <Button
                  variant="contained"
                  sx={{
                    ...styledRectButton,
                    ...forestGreenButton,
                    marginTop: "2%",
                    marginLeft: "3%",
                    width: "40px%",
                  }}
                  onClick={handleNextClick}
                >
                  Next: Create Quiz
                </Button>
              </div>
            </form>
          </div>
          <Footer />{" "}
        </div>
      </div>
    </>
  );
};

export default AdminPathwayEditor;

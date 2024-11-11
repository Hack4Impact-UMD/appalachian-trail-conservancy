import React, { ChangeEvent, useState } from "react";
import styles from "./AdminPathwayEditor.module.css";

import {
  TextField,
  Button,
  FormHelperText,
  Typography,
  Tooltip,
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
} from "../../muiTheme";
import { IoIosInformationCircleOutline, IoIosSearch } from "react-icons/io";
import { styledRectButton } from "../LoginPage/LoginPage";
import Paper from "@mui/material/Paper";
import hamburger from "../../assets/hamburger.svg";

const AdminPathwayEditor: React.FC = () => {
  const [pathwayName, setPathwayName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [description, setDescription] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [searchBars, setSearchBars] = useState([1]); // Start with one search bar (the first one)

  const options = ["blah", "blah blah"];

  const handleAddSearchBar = () => {
    setSearchBars((prevBars) => [...prevBars, prevBars.length + 1]);
  };

  const handleDeleteSearchBar = (index: number) => {
    if (searchBars.length > 1) {
      setSearchBars((prevBars) => prevBars.filter((_, i) => i !== index));
    }
  };

  const [errors, setErrors] = useState({
    pathwayName: "",
    blurb: "",
    description: "",
    resourceLink: "",
  });

  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidBlurb, setInvalidBlurb] = useState<boolean>(false);
  const [invalidDescription, setInvalidDescription] = useState<boolean>(false);

  const characterLimits = {
    pathwayName: 2,
    blurb: 5,
    description: 10,
  };

  const validateFields = () => {
    let newErrors = { ...errors };

    if (pathwayName.length > characterLimits.pathwayName) {
      setInvalidName(true);
      newErrors.pathwayName = `Training name cannot exceed ${characterLimits.pathwayName} characters.`;
    } else {
      newErrors.pathwayName = "";
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

        <div className={styles.editor}>
          <div className={styles.editorContent}>
            {/* Heading */}
            <div className={styles.editorHeader}>
              <h1 className={styles.nameHeading}>Pathways Editor</h1>
              <div className={styles.editorProfileHeader}>
                <h5 className={styles.adminText}> Admin </h5>
                <ProfileIcon />
              </div>
            </div>

            {/* Input Boxes */}
            <form noValidate>
              <Button sx={whiteButtonGrayBorder}>Save as Draft</Button>

              <div className={styles.inputBoxHeader}>
                <Typography
                  variant="body2"
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    marginTop: "2rem",
                  }}
                >
                  PATHWAY NAME
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
                    characterLimits.pathwayName - pathwayName.length,
                    0
                  )}{" "}
                  Characters Remaining
                </Typography>
              </div>

              <TextField
                value={pathwayName}
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
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= characterLimits.pathwayName) {
                    setPathwayName(newValue);
                  }
                }}
                variant="outlined"
                rows={1}
                fullWidth
              />
              {invalidName && (
                <FormHelperText error>
                  Training name cannot exceed {characterLimits.pathwayName}{" "}
                  characters.
                </FormHelperText>
              )}

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
                  {Math.max(characterLimits.blurb - blurb.length, 0)} Characters
                  Remaining
                </Typography>
              </div>

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
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= characterLimits.blurb) {
                    setBlurb(newValue);
                  }
                }}
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
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= characterLimits.description) {
                    setDescription(newValue);
                  }
                }}
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
                    title="Upload will be used as pathway cover and certificate image"
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
                    <span style={{ marginLeft: "8px" }}>
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

              {/* Training Selection */}
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
                  {searchBars.map((_, idx) => (
                    <div key={idx} className={styles.searchBarContainer}>
                      <p className={styles.searchBarNumber}>{idx + 1}</p>{" "}
                      <Autocomplete
                        disablePortal
                        options={options}
                        sx={{
                          ...grayBorderSearchBar,
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="SEARCH"
                            InputLabelProps={{
                              shrink: false,
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                padding: "8px",
                                display: "flex",
                                alignItems: "center",
                              },
                            }}
                          />
                        )}
                        /*  CLOSEST ATTEMPT FOR DROPDOWN STYLE: 
                        PaperComponent={(props) => (
                            <Paper
                              sx={{
                                background: "lightblue",
                                color: "var(--blue-gray)",
                                fontSize: "25px",
                                "&:hover": {
                                  border: "1px solid #00FF00",
                                  color: "gray",
                                  backgroundColor: "white"
                                }
                              }}
                              {...props}
                            />
                          )}*/
                      />
                      <div
                        className={styles.searchBarX}
                        style={{
                          visibility: idx === 0 ? "hidden" : "visible", // Hide for the first search bar
                        }}
                      >
                        <CloseIcon
                          onClick={() => handleDeleteSearchBar(idx)}
                          sx={{
                            marginTop: "2px",
                            color: "var(--blue-gray)",
                            cursor: "pointer",
                            "&:hover": {
                              color: "#d32f2f",
                            },
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className={styles.addTrainingContainer}>
                    <Button
                      sx={{ ...whiteButtonGrayBorder, textAlign: "left" }}
                      onClick={handleAddSearchBar}
                    >
                      Add Training
                    </Button>
                  </div>
                </div>
              </div>

              {/* Button Group */}
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
          <Footer />{" "}
        </div>
      </div>
    </>
  );
};

export default AdminPathwayEditor;

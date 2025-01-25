import React, { useState, useRef, useEffect } from "react";
import styles from "./AdminPathwayEditorPage.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { storage } from "../../config/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  TextField,
  OutlinedInput,
  Button,
  Typography,
  Tooltip,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  grayButton,
  forestGreenButton,
  styledRectButton,
  whiteTooltip,
  autocompleteText,
  whiteSelectGrayBorder,
  whiteButtonGrayBorder,
  whiteButtonRedBorder,
  inputHeaderText,
  inputHelperText,
  grayBorderTextField,
} from "../../muiTheme";
import AddIcon from "@mui/icons-material/Add";
import hamburger from "../../assets/hamburger.svg";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar";
import Footer from "../../components/Footer/Footer";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import PathwayCard from "../../components/PathwayCard/PathwayCard";
import Badge from "../../components/BadgeCard/BadgeCard";
import AdminDeletePathwayDraftPopup from "./AdminDeletePathwayDraftPopup/AdminDeletePathwayDraftPopup";
import { IoCloseOutline } from "react-icons/io5";
import { LuUpload } from "react-icons/lu";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Pathway, PathwayID, Status } from "../../types/PathwayType";
import { TrainingID } from "../../types/TrainingType";
import {
  addPathway,
  updatePathway,
  getAllPublishedTrainings,
} from "../../backend/FirestoreCalls";

import Quill from "quill";
import "quill/dist/quill.snow.css";

const AdminPathwayEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathwayData = location.state?.pathway as PathwayID | undefined;
  const [pathwayId, setPathwayId] = useState<string | undefined>(
    pathwayData?.id
  );
  const status = pathwayData?.status || ("DRAFT" as Status);
  const [pathwayName, setPathwayName] = useState<string>(
    pathwayData?.name || ""
  );
  const [blurb, setBlurb] = useState<string>(pathwayData?.shortBlurb || "");
  const [description, setDescription] = useState<string>(
    pathwayData?.description || ""
  );
  const [descriptionPlain, setDescriptionPlain] = useState<string>(
    pathwayData?.description.replace(/<[^>]*>/g, "") || ""
  );
  const [coverImage, setCoverImage] = useState<string>(
    pathwayData?.coverImage || ""
  );
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const blankTraining: TrainingID = {
    name: "",
    id: "",
    shortBlurb: "",
    description: "",
    coverImage: "",
    resources: [],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    associatedPathways: [],
    status: "PUBLISHED",
  };

  const [selectedTrainings, setSelectedTrainings] = useState<TrainingID[]>([
    blankTraining,
  ]);
  const [trainingOptions, setTrainingOptions] = useState<TrainingID[]>([]);
  const [errorTrainings, setErrorTrainings] = useState<number[]>([]);

  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );

  const handleAddSearchBar = () => {
    setSelectedTrainings([...selectedTrainings, blankTraining]);
  };

  const handleTrainingSelection = (
    selectedTraining: TrainingID | null,
    index: number
  ) => {
    const newTrainings = [...selectedTrainings];
    newTrainings[index] = selectedTraining ?? blankTraining;
    setSelectedTrainings(newTrainings);
  };

  const handleDeleteSearchBar = (index: number) => {
    if (index > 0) {
      const newTrainings = selectedTrainings.filter((_, i) => i !== index);
      setSelectedTrainings(newTrainings);

      // update list of questions with errors
      if (errorTrainings.length !== 0) {
        const newErrorTrainings = errorTrainings
          .filter((errorIndex) => errorIndex !== index)
          .map((errorIndex) =>
            errorIndex > index ? errorIndex - 1 : errorIndex
          );
        setErrorTrainings(newErrorTrainings);
      }
    }
  };

  const [errors, setErrors] = useState({
    pathwayName: "",
    blurb: "",
    description: "",
    coverImage: "",
    trainingIds: "",
  });

  const [openDeleteDraftPopup, setOpenDeleteDraftPopup] =
    useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const descriptionContainerRef = useRef<HTMLDivElement>(null);
  const quillDescriptionRef = useRef<Quill | null>(null);

  const characterLimits = {
    pathwayName: 50,
    blurb: 255,
    description: 1400,
  };

  const changeUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxFileSize = 1048576 * 20; // 20MB
    if (e.target.files) {
      const currFile = e.target.files[0];
      if (!currFile?.size) {
        setSnackbarMessage("Error. Please try again.");
        setSnackbar(true);
        return;
      }
      if (currFile?.size > maxFileSize) {
        e.target.value = "";
        setSnackbarMessage("File is too large. Files must be less than 20MB.");
        setSnackbar(true);
        return;
      }
      setUploadedImage(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (uploadedImage) {
      try {
        // Upload file to firebase storage
        const fileExtension = uploadedImage.name.split(".").pop();
        const randomName = crypto.randomUUID();
        const storageRef = ref(storage, `${randomName}.${fileExtension}`);

        await uploadBytes(storageRef, uploadedImage);
        const downloadURL = await getDownloadURL(storageRef);
        setCoverImage(downloadURL);

        if (pathwayData?.coverImage) {
          // Delete previous image from firebase storage
          const oldFileRef = ref(storage, pathwayData?.coverImage);
          await deleteObject(oldFileRef);
        }

        return [true, downloadURL];
      } catch (error) {
        return [false, ""];
      }
    } else {
      if (coverImage == "" && pathwayData?.coverImage) {
        // Delete previous image from firebase storage
        const oldFileRef = ref(storage, pathwayData?.coverImage);
        await deleteObject(oldFileRef);
      }
    }
    return [true, coverImage];
  };

  const validateFields = (saveAsIs: boolean) => {
    const newErrors = {
      pathwayName: "",
      blurb: "",
      description: "",
      coverImage: "",
      trainingIds: "",
    };
    let isValid = true;

    // Check for required fields
    if (!pathwayName || pathwayName.trim() == "") {
      newErrors.pathwayName = "Pathway name is required.";
      isValid = false;
    }

    // Other fields can be saved empty in draft mode
    if (saveAsIs && status === "DRAFT") {
      setErrors(newErrors);
      return isValid;
    }

    if (!blurb || blurb.trim() == "") {
      newErrors.blurb = "Blurb is required.";
      isValid = false;
    }

    if (!descriptionPlain) {
      newErrors.description = "Description is required.";
      isValid = false;
    }

    if (!coverImage && !uploadedImage) {
      newErrors.coverImage = "Cover image is required.";
      isValid = false;
    }

    let newErrorTrainings = [];
    if (!selectedTrainings || selectedTrainings.length === 0) {
      newErrors.trainingIds = "At least one associated training is required.";
      isValid = false;
    } else {
      newErrorTrainings = selectedTrainings.reduce(
        (indexes, training, index) => {
          if (!training.name) {
            indexes.push(index);
          }
          return indexes;
        },
        [] as number[]
      );

      if (newErrorTrainings.length > 0) {
        setErrorTrainings(newErrorTrainings);
        newErrors.trainingIds = "All associated trainings must be selected.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveClick = async () => {
    setLoading(true);
    // Validate fields only if in edit mode
    if (validateFields(true)) {
      let blankErrors = {
        pathwayName: "",
        blurb: "",
        description: "",
        coverImage: "",
        trainingIds: "",
      };
      setErrors(blankErrors);

      const imageUpload = await handleUploadImage();
      if (!imageUpload[0]) {
        blankErrors = { ...blankErrors, coverImage: "Failed to upload image." };
        setErrors(blankErrors);
        setSnackbarMessage("Failed to upload image. Please try again.");
        setLoading(false);
        setSnackbar(true);
        return;
      }

      if (pathwayId) {
        // Update existing pathway
        const updatedPathway = {
          ...pathwayData,
          name: pathwayName,
          shortBlurb: blurb,
          description: description,
          coverImage: imageUpload[1],
          trainingIDs: selectedTrainings.map((training) => training.id),
          status: status,
        } as Pathway;

        await updatePathway(updatedPathway, pathwayId);
        setLoading(false);
        setSnackbarMessage("Pathway updated successfully.");
      } else {
        // Save as new draft
        const updatedPathway = {
          name: pathwayName,
          shortBlurb: blurb,
          description: description,
          coverImage: imageUpload[1],
          trainingIDs: selectedTrainings.map((training) => training.id),
          quiz: {
            questions: [],
            numQuestions: 0,
            passingScore: 0,
          },
          status: status,
        } as Pathway;

        const newPathwayId = (await addPathway(updatedPathway)) as
          | string
          | undefined;
        setPathwayId(newPathwayId);
        setLoading(false);
        setSnackbarMessage("Draft saved successfully.");
      }
      setSnackbar(true);
    } else {
      setSnackbarMessage("Please complete all required fields.");
      setLoading(false);
      setSnackbar(true);
      return;
    }
  };

  const handleNextClick = async () => {
    setLoading(true);
    if (validateFields(false)) {
      let blankErrors = {
        pathwayName: "",
        blurb: "",
        description: "",
        coverImage: "",
        trainingIds: "",
      };
      setErrors(blankErrors);

      const imageUpload = await handleUploadImage();
      if (!imageUpload[0]) {
        blankErrors = { ...blankErrors, coverImage: "Failed to upload image." };
        setErrors(blankErrors);
        setSnackbarMessage("Failed to upload image. Please try again.");
        setLoading(false);
        setSnackbar(true);
        return;
      }

      if (pathwayId) {
        // Update existing pathway
        const updatedPathway = {
          ...pathwayData,
          name: pathwayName,
          shortBlurb: blurb,
          description: description,
          coverImage: imageUpload[1],
          trainingIDs: selectedTrainings.map((training) => training.id),
          status: status,
        } as Pathway;

        await updatePathway(updatedPathway, pathwayId);
        const updatedPathwayId: PathwayID = {
          ...updatedPathway,
          id: pathwayId,
        };
        setLoading(false);
        setSnackbarMessage("Pathway updated successfully.");
        setSnackbar(true);

        // Navigate to the quiz editor with the pathway as state
        navigate("/pathways/editor/quiz", {
          state: { pathway: updatedPathwayId },
        });
      } else {
        const updatedPathway = {
          name: pathwayName,
          shortBlurb: blurb,
          description: description,
          coverImage: imageUpload[1],
          trainingIDs: selectedTrainings.map((training) => training.id),
          quiz: {
            questions: [],
            numQuestions: 0,
            passingScore: 0,
          },
          status: status,
        } as Pathway;
        const newPathwayId = await addPathway(updatedPathway);
        const updatedPathwayId: PathwayID = {
          ...updatedPathway,
          id: newPathwayId,
        };
        setPathwayId(newPathwayId);
        setLoading(false);
        setSnackbarMessage("Draft saved successfully.");
        setSnackbar(true);

        // Navigate to the quiz editor with the new pathway as state
        navigate("/pathways/editor/quiz", {
          state: { pathway: updatedPathwayId },
        });
      }
    } else {
      setSnackbarMessage("Please complete all required fields.");
      setLoading(false);
      setSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  };

  const renderMarker = () => {
    if (status === "DRAFT") {
      // Training drafted
      return (
        <div className={`${styles.marker} ${styles.draftMarker}`}>DRAFT</div>
      );
    } else if (status === "PUBLISHED") {
      // Training published
      return (
        <div className={`${styles.marker} ${styles.publishedMarker}`}>
          PUBLISHED
        </div>
      );
    } else if (status === "ARCHIVED") {
      // Training archived
      return (
        <div className={`${styles.marker} ${styles.archiveMarker}`}>
          ARCHIVE
        </div>
      );
    }
  };

  useEffect(() => {
    // description quill editor
    if (descriptionContainerRef.current && !quillDescriptionRef.current) {
      quillDescriptionRef.current = new Quill(descriptionContainerRef.current, {
        theme: "snow",
        modules: {
          toolbar: [["bold", "italic", "underline", "link"]],
        },
      });

      quillDescriptionRef.current!.root.innerHTML = description;

      quillDescriptionRef.current.on("text-change", () => {
        // Limit the number of characters in the description
        if (
          quillDescriptionRef.current!.getLength() > characterLimits.description
        ) {
          quillDescriptionRef.current!.deleteText(
            characterLimits.description,
            quillDescriptionRef.current!.getLength()
          );
        }

        // Update content
        const editorContent = quillDescriptionRef.current!.root.innerHTML;
        const plaintext = editorContent.replace(/<[^>]*>/g, "");
        setDescription(editorContent);
        setDescriptionPlain(plaintext);
      });
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getAllPublishedTrainings().then((trainings) => {
      // Sort trainings in alphabetical order by name
      const sortedTrainings = trainings.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      if (pathwayData?.trainingIDs) {
        // set selected trainings
        const selected = sortedTrainings.filter((training) =>
          pathwayData?.trainingIDs.includes(training.id)
        );
        setSelectedTrainings(selected);
      }
      setTrainingOptions(sortedTrainings);
      setLoading(false);
    });
  }, [pathwayData]);

  return (
    <>
      <div className={openDeleteDraftPopup ? styles.popupOpen : ""}>
        <AdminNavigationBar
          open={navigationBarOpen}
          setOpen={setNavigationBarOpen}
        />
      </div>
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
            {/* Heading */}
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <h1 className={styles.nameHeading}>Pathway Editor</h1>
                <div>{renderMarker()}</div>
              </div>
              <ProfileIcon />
            </div>

            {/* Input Boxes */}
            <form className={styles.formContent} noValidate>
              <div className={styles.topButtonContainer}>
                <Button
                  sx={whiteButtonGrayBorder}
                  variant="contained"
                  onClick={handleSaveClick}
                  disabled={loading}>
                  {status == "DRAFT" ? "Save as Draft" : "Save"}
                </Button>

                {status == "DRAFT" ? (
                  <Button
                    sx={{
                      ...whiteButtonRedBorder,
                      width: "100px",
                    }}
                    onClick={() => {
                      setOpenDeleteDraftPopup(true);
                    }}
                    disabled={loading}>
                    DELETE
                  </Button>
                ) : (
                  <></>
                )}
              </div>

              {/* Pathway Name */}
              <div className={styles.inputBoxHeader}>
                <Typography
                  variant="body2"
                  sx={{ ...inputHeaderText, marginTop: "2rem" }}>
                  PATHWAY NAME
                </Typography>

                <Typography variant="body2" sx={inputHelperText}>
                  {Math.max(
                    characterLimits.pathwayName - pathwayName.length,
                    0
                  )}{" "}
                  Characters Remaining
                </Typography>
              </div>

              <OutlinedInput
                value={pathwayName}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= characterLimits.pathwayName) {
                    setPathwayName(newValue);
                  }
                }}
                error={Boolean(errors.pathwayName)}
                sx={{
                  ...grayBorderTextField,
                  width: "100%",
                  border: errors.pathwayName
                    ? "2px solid var(--hazard-red)"
                    : "2px solid var(--blue-gray)",
                }}
              />

              {/* Pathway Blurb */}
              <div className={styles.inputBoxHeader}>
                <Typography
                  variant="body2"
                  sx={{ ...inputHeaderText, marginTop: "2rem" }}>
                  BLURB
                </Typography>

                <Typography variant="body2" sx={inputHelperText}>
                  {Math.max(characterLimits.blurb - blurb.length, 0)} Characters
                  Remaining
                </Typography>
              </div>

              <OutlinedInput
                value={blurb}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= characterLimits.blurb) {
                    setBlurb(newValue);
                  }
                }}
                error={Boolean(errors.blurb)}
                sx={{
                  ...grayBorderTextField,
                  width: "100%",
                  height: "auto",
                  minHeight: 100,
                  border: errors.blurb
                    ? "2px solid var(--hazard-red)"
                    : "2px solid var(--blue-gray)",
                  "& .MuiOutlinedInput-input": {
                    padding: 0,
                  },
                }}
                multiline
                rows={3}
              />

              {/* Pathway Description */}
              <div className={styles.inputBoxHeader}>
                <Typography
                  variant="body2"
                  sx={{ ...inputHeaderText, marginTop: "2rem" }}>
                  DESCRIPTION
                </Typography>

                <Typography variant="body2" sx={inputHelperText}>
                  {Math.max(
                    characterLimits.description - descriptionPlain.length,
                    0
                  )}{" "}
                  Characters Remaining
                </Typography>
              </div>
              <div
                className={`${
                  errors.description ? styles.inputError : styles.quillContainer
                }`}>
                <div
                  ref={descriptionContainerRef}
                  id={styles.quillEditor}
                  style={{
                    height: "100px",
                  }}></div>
              </div>

              {/* Pathway Image */}
              <div className={styles.uploadSection}>
                <div className={styles.uploadResourceHeader}>
                  <Typography variant="body2" sx={inputHeaderText}>
                    UPLOAD IMAGE (JPG, JPEG, PNG)
                  </Typography>
                  <Tooltip
                    title="Image will be used on the pathway badge. Uploaded images must be less than 20MB."
                    placement="right"
                    componentsProps={{
                      tooltip: {
                        sx: { ...whiteTooltip, fontSize: "0.75rem" },
                      },
                    }}>
                    <span className={styles.iconCenter}>
                      <InfoOutlinedIcon />
                    </span>
                  </Tooltip>
                </div>

                <div className={styles.uploadImageContainer}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      ...grayButton,
                      border: errors.coverImage
                        ? "2px solid var(--hazard-red)"
                        : "2px solid var(--lighter-grey)",
                    }}>
                    <LuUpload style={{ fontSize: "50px" }} />
                    <input
                      type="file"
                      id="upload"
                      hidden
                      accept=".jpg,.jpeg,.png"
                      onChange={async (e) => {
                        changeUploadImage(e);
                      }}
                    />
                  </Button>
                  {(coverImage || uploadedImage) && (
                    <div className={`${styles.closeIcon} ${styles.leftMargin}`}>
                      <IoCloseOutline
                        onClick={() => {
                          setUploadedImage(null);
                          setCoverImage("");
                        }}
                      />
                    </div>
                  )}
                </div>
                {(coverImage || uploadedImage) && (
                  <div className={styles.previewSection}>
                    <PathwayCard
                      pathway={{
                        id: pathwayId!,
                        name: pathwayName,
                        shortBlurb: blurb,
                        description: description,
                        coverImage: uploadedImage
                          ? URL.createObjectURL(uploadedImage)
                          : coverImage,
                        trainingIDs: selectedTrainings.map(
                          (training) => training.id
                        ),
                        quiz: {
                          questions: [],
                          numQuestions: 0,
                          passingScore: 0,
                        },
                        status: status,
                      }}
                      preview={true}
                    />
                    <Badge
                      image={
                        uploadedImage
                          ? URL.createObjectURL(uploadedImage)
                          : coverImage
                      }
                      title={pathwayName}
                      date={new Date(Date.now()).toISOString()}
                    />
                  </div>
                )}
              </div>

              {/* Training Selection */}
              <div className={styles.trainingSelection}>
                <Typography
                  variant="body2"
                  sx={{ ...inputHeaderText, marginTop: "2rem" }}>
                  TRAINING SELECT
                </Typography>

                {selectedTrainings.map((training, trainingIndex) => (
                  <div
                    key={trainingIndex}
                    className={styles.searchBarContainer}>
                    <p className={styles.searchBarNumber}>
                      {trainingIndex + 1}
                    </p>
                    <Autocomplete
                      sx={{
                        ...whiteSelectGrayBorder,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        border: errorTrainings.includes(trainingIndex)
                          ? "2px solid var(--hazard-red)"
                          : "2px solid var(--blue-gray)",
                      }}
                      slotProps={{
                        // style options
                        paper: {
                          sx: {
                            "& .MuiAutocomplete-listbox": {
                              "& .MuiAutocomplete-option": {
                                color: "var(--blue-gray)",
                              },
                            },
                          },
                        },
                      }}
                      disablePortal
                      value={training}
                      getOptionLabel={(option) => option.name}
                      options={trainingOptions}
                      getOptionDisabled={(option) =>
                        selectedTrainings.some(
                          (selectedTrainings) => selectedTrainings === option
                        )
                      }
                      onChange={(event, selected) => {
                        handleTrainingSelection(selected, trainingIndex);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="SEARCH"
                          InputLabelProps={{
                            shrink: false,
                          }}
                          sx={autocompleteText}
                        />
                      )}
                      readOnly={status !== "DRAFT"}
                    />
                    {trainingIndex > 0 && status === "DRAFT" ? (
                      <div
                        className={`${styles.closeIcon} ${styles.leftMargin}`}>
                        <IoCloseOutline
                          onClick={() => handleDeleteSearchBar(trainingIndex)}
                        />
                      </div>
                    ) : (
                      <div
                        className={`${styles.closeIcon} ${styles.leftMargin}`}
                        style={{ visibility: "hidden" }}>
                        <IoCloseOutline />
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Training Button */}
                {status === "DRAFT" && (
                  <div
                    className={styles.addTrainingContainer}
                    onClick={handleAddSearchBar}>
                    <AddIcon fontSize="medium" />
                    <h3>ADD TRAINING</h3>
                  </div>
                )}
              </div>

              {/* Button Group */}
              <div className={styles.nextButton}>
                <Button
                  variant="contained"
                  sx={{
                    ...styledRectButton,
                    ...forestGreenButton,
                    marginTop: "2%",
                    width: "40px%",
                  }}
                  onClick={handleNextClick}
                  disabled={loading}>
                  {status == "DRAFT" ? "Next: Create Quiz" : "Next: Edit Quiz"}
                </Button>
              </div>
            </form>
          </div>
          {/* Snackbar wrapper container */}
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
          <AdminDeletePathwayDraftPopup
            open={openDeleteDraftPopup}
            onClose={setOpenDeleteDraftPopup}
            pathwayId={pathwayId}
            coverImage={coverImage}
          />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AdminPathwayEditorPage;

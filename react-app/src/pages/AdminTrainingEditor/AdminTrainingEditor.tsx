import React, { useState, useEffect, useRef } from "react";
import styles from "./AdminTrainingEditor.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  OutlinedInput,
  Button,
  MenuItem,
  Select,
  FormControl,
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
import { storage } from "../../config/firebase";
import { addTraining, updateTraining } from "../../backend/FirestoreCalls";
import {
  TrainingID,
  Training,
  TrainingResource,
  Status,
} from "../../types/TrainingType";
import hamburger from "../../assets/hamburger.svg";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar";
import Footer from "../../components/Footer/Footer";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import AdminDeleteTrainingDraftPopup from "./AdminDeleteTrainingDraftPopup/AdminDeleteTrainingDraftPopup";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import Certificate from "../../components/CertificateCard/CertificateCard";
import { LuUpload } from "react-icons/lu";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import {
  grayButton,
  styledRectButton,
  forestGreenButton,
  whiteButtonGrayBorder,
  whiteSelectGrayBorder,
  selectOptionStyle,
  inputHeaderText,
  inputHelperText,
  grayBorderTextField,
  whiteButtonRedBorder,
  whiteTooltip,
} from "../../muiTheme";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const AdminTrainingEditor: React.FC = () => {
  const location = useLocation();
  const trainingData = location.state?.training as TrainingID | undefined;
  const navigate = useNavigate();
  const [trainingId, setTrainingId] = useState<string | undefined>(
    trainingData?.id
  );
  const status = trainingData?.status || ("DRAFT" as Status);
  const [trainingName, setTrainingName] = useState<string>(
    trainingData?.name || ""
  );
  const [blurb, setBlurb] = useState<string>(trainingData?.shortBlurb || "");
  const [description, setDescription] = useState<string>(
    trainingData?.description || ""
  );
  const [descriptionPlain, setDescriptionPlain] = useState<string>(
    trainingData?.description.replace(/<[^>]*>/g, "") || ""
  );
  const [resourceTitle, setResourceTitle] = useState<string>(
    trainingData?.resources[0]?.title || ""
  );
  const [resourceLink, setResourceLink] = useState<string>(
    trainingData?.resources[0]?.link || ""
  );
  const [resourceType, setResourceType] = useState<string>(
    trainingData?.resources[0]?.type || ""
  );
  const [coverImage, setCoverImage] = useState<string>(
    trainingData?.coverImage || ""
  );

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );

  const [openDeleteDraftPopup, setOpenDeleteDraftPopup] =
    useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [errors, setErrors] = useState({
    trainingName: "",
    blurb: "",
    description: "",
    coverImage: "",
    resourceTitle: "",
    resourceLink: "",
    resourceType: "",
  });

  const descriptionContainerRef = useRef<HTMLDivElement>(null);
  const quillDescriptionRef = useRef<Quill | null>(null);

  const characterLimits = {
    trainingName: 70,
    blurb: 255,
    description: 1400,
    resourceTitle: 50,
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

        if (trainingData?.coverImage) {
          // Delete previous image from firebase storage
          const oldFileRef = ref(storage, trainingData?.coverImage);
          await deleteObject(oldFileRef);
        }

        return [true, downloadURL];
      } catch (error) {
        return [false, ""];
      }
    } else {
      if (coverImage == "" && trainingData?.coverImage) {
        // Delete previous image from firebase storage
        const oldFileRef = ref(storage, trainingData?.coverImage);
        await deleteObject(oldFileRef);
      }
    }
    return [true, coverImage];
  };

  // make sure all fields are good before moving on
  const validateFields = (saveAsIs: boolean) => {
    const newErrors = {
      trainingName: "",
      blurb: "",
      description: "",
      coverImage: "",
      resourceTitle: "",
      resourceLink: "",
      resourceType: "",
    };
    let isValid = true;

    // Check for required fields
    if (!trainingName) {
      newErrors.trainingName = "Training name is required.";
      isValid = false;
    }

    // Other fields can be saved empty in draft mode
    if (saveAsIs && status === "DRAFT") {
      setErrors(newErrors);
      return isValid;
    }

    if (!blurb) {
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

    if (!resourceTitle) {
      newErrors.resourceTitle = "Resource Title is required.";
      isValid = false;
    }

    if (!resourceLink) {
      newErrors.resourceLink = "Resource Link is required.";
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
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveClick = async () => {
    setLoading(true);
    // Validate fields only if in edit mode
    if (validateFields(true)) {
      let blankErrors = {
        trainingName: "",
        blurb: "",
        description: "",
        coverImage: "",
        resourceTitle: "",
        resourceLink: "",
        resourceType: "",
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

      if (trainingId) {
        // Update existing training
        const updatedTraining = {
          ...trainingData,
          name: trainingName,
          shortBlurb: blurb,
          description: description,
          coverImage: imageUpload[1],
          resources: [
            {
              title: resourceTitle,
              link: resourceLink,
              type: resourceType,
            } as TrainingResource,
          ],
          status: status,
        } as Training;
        await updateTraining(updatedTraining, trainingId);
        setLoading(false);
        setSnackbarMessage("Training updated successfully.");
      } else {
        // Save as new draft
        const updatedTraining = {
          name: trainingName,
          shortBlurb: blurb,
          description: description,
          coverImage: imageUpload[1],
          resources: [
            {
              title: resourceTitle,
              link: resourceLink,
              type: resourceType,
            } as TrainingResource,
          ],
          quiz: {
            questions: [],
            numQuestions: 0,
            passingScore: 0,
          },
          associatedPathways: [],
          certificationImage: "",
          status: status,
        } as Training;
        const newTrainingId = (await addTraining(updatedTraining)) as
          | string
          | undefined;
        setTrainingId(newTrainingId);
        setLoading(false);
        setSnackbarMessage("Draft saved successfully.");
      }
      setSnackbar(true);
    } else {
      if (
        errors.resourceLink == "Please provide a valid embedded YouTube link."
      ) {
        setSnackbarMessage("Please provide a valid embedded YouTube link.");
      } else {
        setSnackbarMessage("Please complete all required fields.");
      }
      setLoading(false);
      setSnackbar(true);
      return;
    }
  };

  const handleNextClick = async () => {
    setLoading(true);
    if (validateFields(false)) {
      let blankErrors = {
        trainingName: "",
        blurb: "",
        description: "",
        coverImage: "",
        resourceTitle: "",
        resourceLink: "",
        resourceType: "",
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

      if (trainingId) {
        const updatedTraining = {
          ...trainingData,
          name: trainingName,
          shortBlurb: blurb,
          description: description,
          coverImage: imageUpload[1],
          resources: [
            {
              title: resourceTitle,
              link: resourceLink,
              type: resourceType,
            } as TrainingResource,
          ],
          status: status,
        } as Training;

        await updateTraining(updatedTraining, trainingId);
        setLoading(false);
        setSnackbarMessage("Training updated successfully.");
        setSnackbar(true);

        // Navigate to the quiz editor with the training as state
        const updatedTrainingId: TrainingID = {
          ...updatedTraining,
          id: trainingId,
        };
        navigate("/trainings/editor/quiz", {
          state: { training: updatedTrainingId },
        });
      } else {
        const updatedTraining = {
          name: trainingName,
          shortBlurb: blurb,
          description: description,
          coverImage: imageUpload[1],
          resources: [
            {
              title: resourceTitle,
              link: resourceLink,
              type: resourceType,
            } as TrainingResource,
          ],
          quiz: {
            questions: [],
            numQuestions: 0,
            passingScore: 0,
          },
          associatedPathways: [],
          certificationImage: "",
          status: status,
        } as Training;
        const newTrainingId = await addTraining(updatedTraining);
        const updatedTrainingId: TrainingID = {
          ...updatedTraining,
          id: newTrainingId,
        };
        setTrainingId(newTrainingId);
        setLoading(false);
        setSnackbarMessage("Draft saved successfully.");
        setSnackbar(true);

        // Navigate to the quiz editor with the new training as state
        navigate("/trainings/editor/quiz", {
          state: { training: updatedTrainingId },
        });
      }
    } else {
      if (
        errors.resourceLink == "Please provide a valid embedded YouTube link."
      ) {
        setSnackbarMessage("Please provide a valid embedded YouTube link.");
      } else {
        setSnackbarMessage("Please complete all required fields.");
      }
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
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <h1 className={styles.headerText}>Training Editor</h1>
                <div>{renderMarker()}</div>
              </div>
              <ProfileIcon />
            </div>

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

              {/* Training Name */}
              <div className={styles.inputBoxHeader}>
                <Typography
                  variant="body2"
                  sx={{ ...inputHeaderText, marginTop: "2rem" }}>
                  TRAINING NAME
                </Typography>

                <Typography variant="body2" sx={inputHelperText}>
                  {Math.max(
                    characterLimits.trainingName - trainingName.length,
                    0
                  )}{" "}
                  Characters Remaining
                </Typography>
              </div>
              <OutlinedInput
                value={trainingName}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= characterLimits.trainingName) {
                    setTrainingName(newValue);
                  }
                }}
                error={Boolean(errors.trainingName)}
                sx={{
                  ...grayBorderTextField,
                  width: "100%",
                  border: errors.trainingName
                    ? "2px solid var(--hazard-red)"
                    : "2px solid var(--blue-gray)",
                }}
              />

              {/* Training Blurb */}
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

              {/* Training Description */}
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

              {/* Training Image */}
              <div className={styles.uploadSection}>
                <div className={styles.uploadResourceHeader}>
                  <Typography variant="body2" sx={inputHeaderText}>
                    UPLOAD IMAGE (JPG, JPEG, PNG)
                  </Typography>
                  <Tooltip
                    title="Image will be used on the training card and certificate. Uploaded images must be less than 20MB."
                    placement="right"
                    componentsProps={{
                      tooltip: {
                        sx: { ...whiteTooltip, fontSize: "0.75rem" },
                      },
                    }}>
                    <span className={styles.iconCenter}>
                      <IoIosInformationCircleOutline />
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
                  <div className={`${styles.closeIcon} ${styles.leftMargin}`}>
                    <IoCloseOutline
                      onClick={() => {
                        setUploadedImage(null);
                        setCoverImage("");
                      }}
                    />
                  </div>
                </div>
                {(coverImage || uploadedImage) && (
                  <div className={styles.previewSection}>
                    <TrainingCard
                      training={{
                        id: trainingId!,
                        name: trainingName,
                        shortBlurb: blurb,
                        description: description,
                        coverImage: uploadedImage
                          ? URL.createObjectURL(uploadedImage)
                          : coverImage,
                        resources: [
                          {
                            title: resourceTitle,
                            link: resourceLink,
                            type: resourceType,
                          } as TrainingResource,
                        ],
                        quiz: {
                          questions: [],
                          numQuestions: 0,
                          passingScore: 0,
                        },
                        associatedPathways: [],
                        certificationImage: "",
                        status: status,
                      }}
                      preview={true}
                    />
                    <Certificate
                      image={
                        uploadedImage
                          ? URL.createObjectURL(uploadedImage)
                          : coverImage
                      }
                      title={trainingName}
                      date={new Date(Date.now()).toISOString()}
                    />
                  </div>
                )}
              </div>

              {/* Resource Title */}
              <div className={styles.inputBoxHeader}>
                <Typography
                  variant="body2"
                  sx={{ ...inputHeaderText, marginTop: "2rem" }}>
                  RESOURCE TITLE
                </Typography>

                <Typography variant="body2" sx={inputHelperText}>
                  {Math.max(
                    characterLimits.resourceTitle - resourceTitle.length,
                    0
                  )}{" "}
                  Characters Remaining
                </Typography>
              </div>
              <OutlinedInput
                value={resourceTitle}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= characterLimits.resourceTitle) {
                    setResourceTitle(newValue);
                  }
                }}
                error={Boolean(errors.resourceTitle)}
                sx={{
                  ...grayBorderTextField,
                  width: "100%",
                  border: errors.resourceTitle
                    ? "2px solid var(--hazard-red)"
                    : "2px solid var(--blue-gray)",
                }}
              />

              {/* Resource Link and Tooltip */}
              <div
                className={styles.uploadResourceHeader}
                style={{
                  marginTop: "2rem",
                }}>
                <Typography variant="body2" sx={inputHeaderText}>
                  RESOURCE LINK
                </Typography>

                <Tooltip
                  title="Link to PDF or Embedded YouTube Video. To get the embed link, click on the 'share' button on the YouTube video and then click on 'Embed'. Grab the link from the code which is everything inside the src attribute."
                  placement="right"
                  componentsProps={{
                    tooltip: {
                      sx: { ...whiteTooltip, fontSize: "0.75rem" },
                    },
                  }}>
                  <span className={styles.iconCenter}>
                    <IoIosInformationCircleOutline />
                  </span>
                </Tooltip>
              </div>
              <div className={styles.resourceContainer}>
                <OutlinedInput
                  value={resourceLink}
                  onChange={(e) => setResourceLink(e.target.value)}
                  error={Boolean(errors.resourceLink)}
                  sx={{
                    ...grayBorderTextField,
                    flexGrow: 1,
                    width: "100%",
                    border: errors.resourceLink
                      ? "2px solid var(--hazard-red)"
                      : "2px solid var(--blue-gray)",
                  }}
                />

                <FormControl
                  margin="normal"
                  sx={{ marginTop: "0px", marginBottom: "0" }}
                  className={styles.resourceTypeField}
                  error={Boolean(errors.resourceType)}>
                  <Select
                    className={styles.dropdownMenu}
                    sx={{
                      ...whiteSelectGrayBorder,
                      fontSize: "1.1rem",
                      borderRadius: "10px",
                      height: "3rem",
                      border: errors.resourceType
                        ? "2px solid var(--hazard-red)"
                        : "2px solid var(--blue-gray)",
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
                    <MenuItem value="PDF" sx={selectOptionStyle}>
                      PDF
                    </MenuItem>
                    <MenuItem value="VIDEO" sx={selectOptionStyle}>
                      Video
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Button group */}
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
          <AdminDeleteTrainingDraftPopup
            open={openDeleteDraftPopup}
            onClose={setOpenDeleteDraftPopup}
            trainingId={trainingId}
            coverImage={coverImage}
          />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AdminTrainingEditor;

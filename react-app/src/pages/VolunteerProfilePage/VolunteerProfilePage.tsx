import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { getVolunteer, updateVolunteer } from "../../backend/FirestoreCalls";
import { Button, Tooltip, Alert, Snackbar, TextField } from "@mui/material";
import { Volunteer } from "../../types/UserType";
import styles from "./VolunteerProfilePage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SettingsProfileIcon from "../../components/SettingsProfileIcon/SettingsProfileIcon";
import Footer from "../../components/Footer/Footer";
import hamburger from "../../assets/hamburger.svg";
import {
  grayBorderTextField,
  forestGreenButton,
  styledRectButton,
  whiteButtonGrayBorder,
} from "../../muiTheme";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function VolunteerProfilePage() {
  const auth = useAuth();
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [volunteer, setVolunteer] = useState<Volunteer>();
  const [firstName, setFirstName] = useState<string>(auth.firstName);
  const [lastName, setLastName] = useState<string>(auth.lastName);

  const [isEditing, setIsEditing] = useState(false);

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const getTrainingsCompleted = async () => {
      if (!auth.loading && auth.id) {
        getVolunteer(auth.id.toString())
          .then((volunteer) => {
            setFirstName(auth.firstName);
            setLastName(auth.lastName);
            setVolunteer(volunteer);
          })
          .catch((e) => {
            //TODO: Handle error
          });
      }
    };

    getTrainingsCompleted();
  }, [auth.loading, auth.id]);

  const handleUpdateName = () => {
    if (volunteer != undefined) {
      if (firstName != "" && lastName != "") {
        updateVolunteer({ ...volunteer, firstName, lastName }, auth.id)
          .then(() => {
            setSnackbarMessage("Volunteer name updated successfully");
          })
          .catch((e) => {
            setSnackbarMessage("Error updating volunteer name");
          })
          .finally(() => {
            setIsEditing(false);
            setSnackbar(true);
          });
      } else {
        setFirstName(volunteer?.firstName ?? "");
        setLastName(volunteer?.lastName ?? "");
        setIsEditing(false);
        setSnackbarMessage("First name and last name cannot be empty");
        setSnackbar(true);
      }
    }
  };

  const handleCancelEdit = () => {
    setFirstName(volunteer?.firstName ?? "");
    setLastName(volunteer?.lastName ?? "");
    setIsEditing(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  };

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />

      <div
        className={`${styles.split} ${styles.right}`}
        style={{
          // Only apply left shift when screen width is greater than 1200px
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}
      >
        {!navigationBarOpen && (
          <img
            src={hamburger}
            alt="Hamburger Menu"
            className={styles.hamburger} // Add styles to position it
            width={30}
            onClick={() => setNavigationBarOpen(true)} // Set sidebar open when clicked
          />
        )}
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Profile Page</h1>
            </div>
            <div className={styles.profileContainer}>
              <div className={styles.leftContainer}>
                <div className={styles.subHeader}>First Name</div>
                <div className={styles.inputContainer}>
                  <TextField
                    value={isEditing ? firstName : volunteer?.firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{ ...grayBorderTextField }}
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />
                </div>
                <div className={styles.subHeader}>Last Name</div>
                <div className={styles.inputContainer}>
                  <TextField
                    value={isEditing ? lastName : volunteer?.lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{ ...grayBorderTextField }}
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />
                </div>
                <div className={styles.emailSubHeader}>
                  <div className={styles.subHeader}>
                    Registered email
                    <Tooltip
                      title="You cannot edit this email. You must create a new account if so."
                      placement="right-start"
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "white",
                            color: "black",
                            borderRadius: "8px",
                            padding: "10px",
                            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                          },
                        },
                      }}
                    >
                      <InfoOutlinedIcon />
                    </Tooltip>
                  </div>
                </div>
                <div className={styles.inputContainer}>
                  <TextField
                    value={volunteer?.email ?? ""}
                    disabled
                    sx={{
                      ...grayBorderTextField,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "grey",
                      },
                    }}
                  />
                </div>

                <div className={styles.buttonContainer}>
                  {isEditing ? (
                    <>
                      <Button
                        variant="contained"
                        sx={{
                          ...whiteButtonGrayBorder,
                        }}
                        onClick={handleCancelEdit}
                      >
                        CANCEL
                      </Button>
                      <Button
                        sx={forestGreenButton}
                        variant="contained"
                        onClick={handleUpdateName}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button
                      sx={forestGreenButton}
                      variant="contained"
                      onClick={() => {
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              <div className={styles.profileIcon}>
                <SettingsProfileIcon />
              </div>
            </div>
          </div>
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
              }
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default VolunteerProfilePage;

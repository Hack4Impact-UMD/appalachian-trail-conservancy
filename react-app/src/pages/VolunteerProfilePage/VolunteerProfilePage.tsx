import styles from "./VolunteerProfilePage.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import EditNamePopup from "./EditNamePopup/EditNamePopup";
import EditEmailPopup from "./EditEmailPopup/EditEmailPopup";
import { Tooltip, Alert, Snackbar, TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getVolunteer } from "../../backend/FirestoreCalls";
import { Volunteer } from "../../types/UserType";
import VolunteerNavigationBar from "../../components/VolunteerNavigationBar/VolunteerNavigationBar";
import Loading from "../../components/LoadingScreen/Loading";
import SettingsProfileIcon from "../../components/SettingsProfileIcon/SettingsProfileIcon";
import Footer from "../../components/Footer/Footer";
import hamburger from "../../assets/hamburger.svg";
import { grayBorderTextField } from "../../muiTheme";

function VolunteerProfilePage() {
  const auth = useAuth();
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const [loading, setLoading] = useState<boolean>(true);

  const [volunteer, setVolunteer] = useState<Volunteer>();

  // state for handling edit name popup
  const [openEditNamePopup, setEditNamePopup] = useState<boolean>(false);
  const [editNameType, setEditNameType] = useState<string>("First");

  // state for handling edit email popup
  const [openEditEmailPopup, setEditEmailPopup] = useState<boolean>(false);

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
    if (!auth.loading && auth.id) {
      getVolunteer(auth.id.toString())
        .then((volunteer) => {
          setVolunteer(volunteer);
        })
        .catch((e) => {
          //TODO: Handle error
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [auth.loading, auth.id]);

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  };

  return (
    <>
      <div
        className={
          openEditNamePopup || openEditEmailPopup ? styles.popupOpen : ""
        }>
        <VolunteerNavigationBar
          open={navigationBarOpen}
          setOpen={setNavigationBarOpen}
        />
      </div>

      <div
        className={`${styles.split} ${styles.right}`}
        style={{
          // Only apply left shift when screen width is greater than 1200px
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}>
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

            {loading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : (
              <div className={styles.profileContainer}>
                <div className={styles.leftContainer}>
                  <div className={styles.subHeader}>First Name</div>
                  <div className={styles.inputContainer}>
                    <TextField
                      disabled
                      value={volunteer?.firstName}
                      className={styles.inputTextField}
                      sx={grayBorderTextField}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={"Edit"}>
                            <IconButton
                              onClick={() => {
                                setEditNameType("First");
                                setEditNamePopup(true);
                              }}
                              sx={{ color: "var(--blue-gray)" }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                  </div>

                  <div className={styles.subHeader}>Last Name</div>
                  <div className={styles.inputContainer}>
                    <TextField
                      disabled
                      value={volunteer?.lastName}
                      className={styles.inputTextField}
                      sx={grayBorderTextField}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={"Edit"}>
                            <IconButton
                              onClick={() => {
                                setEditNameType("Last");
                                setEditNamePopup(true);
                              }}
                              sx={{ color: "var(--blue-gray)" }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                  </div>

                  <div className={styles.subHeader}>Registered Email</div>
                  <div className={styles.inputContainer}>
                    <TextField
                      value={volunteer?.email ?? ""}
                      disabled
                      className={`${styles.emailTextField} ${styles.inputTextField}`}
                      sx={grayBorderTextField}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={"Edit"}>
                            <IconButton
                              onClick={() => {
                                setEditEmailPopup(true);
                              }}
                              sx={{ color: "var(--blue-gray)" }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                  </div>
                </div>
                <div className={styles.profileIcon}>
                  <SettingsProfileIcon />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Edit Popups */}
        <EditNamePopup
          open={openEditNamePopup}
          onClose={setEditNamePopup}
          editType={editNameType}
          volunteer={volunteer}
          setVolunteer={setVolunteer}
          setSnackbar={setSnackbar}
          setSnackbarMessage={setSnackbarMessage}
        />

        <EditEmailPopup
          open={openEditEmailPopup}
          onClose={setEditEmailPopup}
          volunteer={volunteer}
          setVolunteer={setVolunteer}
          setSnackbar={setSnackbar}
          setSnackbarMessage={setSnackbarMessage}
        />

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
        <Footer />
      </div>
    </>
  );
}

export default VolunteerProfilePage;

import styles from "./AdminProfilePage.module.css";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import Loading from "../../components/LoadingScreen/Loading";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar";
import EditNamePopup from "./EditNamePopup/EditNamePopup";
import EditCredentialPopup from "./EditCredentialPopup/EditCredentialPopup";
import { useAuth } from "../../auth/AuthProvider";
import { getAdmin } from "../../backend/AdminFirestoreCalls";
import { Tooltip, Alert, Snackbar, TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Admin } from "../../types/UserType";
import SettingsProfileIcon from "../../components/SettingsProfileIcon/SettingsProfileIcon";
import hamburger from "../../assets/hamburger.svg";
import { grayBorderTextField } from "../../muiTheme";

function AdminProfilePage() {
  const auth = useAuth();
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const [loading, setLoading] = useState<boolean>(true);

  const [admin, setAdmin] = useState<Admin>();

  // state for handling edit name popup
  const [openEditNamePopup, setEditNamePopup] = useState<boolean>(false);
  const [editNameType, setEditNameType] = useState<string>("First");

  // state for handling edit credential popup
  const [openEditCredentialPopup, setEditCredentialPopup] =
    useState<boolean>(false);
  const [editCredentialType, setEditCredentialType] = useState<string>("Email");

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
      getAdmin(auth.id)
        .then((admin) => {
          setAdmin(admin);
        })
        .catch((e) => {
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
          openEditNamePopup || openEditCredentialPopup ? styles.popupOpen : ""
        }>
        <AdminNavigationBar
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
                      value={admin?.firstName}
                      sx={grayBorderTextField}
                      className={styles.inputTextField}
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
                      value={admin?.lastName}
                      sx={grayBorderTextField}
                      className={styles.inputTextField}
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
                      value={admin?.email ?? ""}
                      disabled
                      sx={grayBorderTextField}
                      className={styles.inputTextField}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={"Edit"}>
                            <IconButton
                              onClick={() => {
                                setEditCredentialType("Email");
                                setEditCredentialPopup(true);
                              }}
                              sx={{ color: "var(--blue-gray)" }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                  </div>

                  <div className={styles.subHeader}>Password</div>
                  <div className={styles.inputContainer}>
                    <TextField
                      value={"•••••••••••"}
                      disabled
                      sx={grayBorderTextField}
                      className={styles.inputTextField}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={"Edit"}>
                            <IconButton
                              onClick={() => {
                                setEditCredentialType("Password");
                                setEditCredentialPopup(true);
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
          admin={admin}
          setAdmin={setAdmin}
          setSnackbar={setSnackbar}
          setSnackbarMessage={setSnackbarMessage}
        />

        <EditCredentialPopup
          open={openEditCredentialPopup}
          onClose={setEditCredentialPopup}
          editType={editCredentialType}
          admin={admin}
          setAdmin={setAdmin}
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

export default AdminProfilePage;

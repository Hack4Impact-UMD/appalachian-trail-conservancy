import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { getVolunteer, updateVolunteer } from "../../backend/FirestoreCalls";
import { OutlinedInput, Button, Tooltip, Alert, Snackbar } from "@mui/material";
import { Volunteer } from "../../types/UserType";
import styles from "./VolunteerProfilePage.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SettingsProfileIcon from "../../components/SettingsProfileIcon/SettingsProfileIcon";
import Footer from "../../components/Footer/Footer";
import hamburger from "../../assets/hamburger.svg";
import { grayBorderTextField, forestGreenButton } from "../../muiTheme";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function VolunteerProfilePage() {
  const auth = useAuth();
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [volunteerCopy, setVolunteerCopy] = useState<Volunteer>();
  const [firstName, setFirstName] = useState<string>(auth.firstName);
  const [lastName, setLastName] = useState<string>(auth.lastName);

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
        try {
          const volunteer = await getVolunteer(auth.id.toString());
          setFirstName(auth.firstName);
          setLastName(auth.lastName);
          console.log(volunteer);
          setVolunteerCopy(volunteer);
        } catch (error) {}
      }
    };

    getTrainingsCompleted();
  }, [auth.loading, auth.id]);

  const updateName = () => {
    if (volunteerCopy != undefined) {
      updateVolunteer({ ...volunteerCopy, firstName, lastName }, auth.id)
        .then(() => {
          console.log("Volunteer updated successfully");
        })
        .catch((error) => {
          console.error("Error updating volunteer:", error);
        });
    }
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
                  <OutlinedInput
                    defaultValue={auth.firstName}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{ ...grayBorderTextField }}
                  />
                </div>
                <div className={styles.subHeader}>Last Name</div>
                <div className={styles.inputContainer}>
                  <OutlinedInput
                    defaultValue={auth.lastName}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{ ...grayBorderTextField }}
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
                          },
                        },
                      }}
                    >
                      <InfoOutlinedIcon />
                    </Tooltip>
                  </div>
                </div>
                <div className={styles.inputContainer}>
                  <OutlinedInput
                    value={volunteerCopy ? volunteerCopy.email : ""}
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
                  <Button
                    sx={forestGreenButton}
                    variant="contained"
                    onClick={updateName}
                  >
                    Save
                  </Button>
                </div>
              </div>
              <div className={styles.profileIcon}>
                <SettingsProfileIcon />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default VolunteerProfilePage;

import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Link } from "react-router-dom";
import { getVolunteer, updateVolunteer } from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType";
import { VolunteerPathway, VolunteerTraining } from "../../types/UserType";
import { OutlinedInput, Button, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { forestGreenButtonPadding } from "../../muiTheme";
import { Volunteer } from "../../types/UserType";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import PathwayCard from "../../components/PathwayCard/PathwayCard";
import styles from "./VolunteerProfilePage.module.css";
import Certificate from "../../components/CertificateCard/CertificateCard";
import Badge from "../../components/BadgeCard/BadgeCard";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Loading from "../../components/LoadingScreen/Loading";
import SettingsProfileIcon from "../../components/SettingsProfileIcon/SettingsProfileIcon";
import Footer from "../../components/Footer/Footer";
import hamburger from "../../assets/hamburger.svg";
import {
  grayBorderTextField,
  whiteButtonGrayBorder,
  whiteButtonOceanGreenBorder,
  whiteButtonGreenBorder,
  forestGreenButton,
} from "../../muiTheme";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function VolunteerProfilePage() {
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [volunteerCopy, setVolunteerCopy] = useState<Volunteer>();
  const [firstName, setFirstName] = useState<String>(auth.firstName);
  const [lastName, setLastName] = useState<String>(auth.lastName);

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
          console.log(volunteer);
          setVolunteerCopy(volunteer);
          setLoading(false);
        } catch (error) {}
      }
    };

    getTrainingsCompleted();
  }, [auth.loading, auth.id]);

  function updateName() {
    if (volunteerCopy != undefined)
      updateVolunteer(
        { ...volunteerCopy, firstName, lastName },
        volunteerCopy.auth_id
      )
        .then(() => {
          console.log("Volunteer updated successfully");
        })
        .catch((error) => {
          console.error("Error updating volunteer:", error);
        });
  }

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
                <div className={styles.profileItem}>First Name</div>
                <div className={styles.profileItem}>
                  <OutlinedInput
                    defaultValue={auth.firstName}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{ ...grayBorderTextField }}
                  ></OutlinedInput>
                </div>
                <div className={styles.profileItem}>Last Name</div>
                <div className={styles.profileItem}>
                  <OutlinedInput
                    defaultValue={auth.lastName}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{ ...grayBorderTextField }}
                  ></OutlinedInput>
                </div>
                <div className={styles.emailBox}>
                  <div className={styles.profileItem}>Registered email</div>
                  <div>
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
                <div className={styles.profileItem}>
                  <OutlinedInput
                    sx={{ ...grayBorderTextField }}
                  ></OutlinedInput>
                </div>

                <div className={styles.profileItem}>
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

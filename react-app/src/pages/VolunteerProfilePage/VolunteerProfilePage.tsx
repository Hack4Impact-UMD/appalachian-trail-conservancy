import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Link } from "react-router-dom";
import { getVolunteer } from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType";
import { VolunteerPathway, VolunteerTraining } from "../../types/UserType";
import { OutlinedInput, Button, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { forestGreenButtonPadding } from "../../muiTheme";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import PathwayCard from "../../components/PathwayCard/PathwayCard";
import styles from "./VolunteerProfilePage.module.css";
import Certificate from "../../components/CertificateCard/CertificateCard";
import Badge from "../../components/BadgeCard/BadgeCard";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Loading from "../../components/LoadingScreen/Loading";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";
import hamburger from "../../assets/hamburger.svg";
import { grayBorderTextField, whiteButtonGrayBorder, whiteButtonOceanGreenBorder, whiteButtonGreenBorder, forestGreenButton } from "../../muiTheme"


function VolunteerProfilePage() {
    const auth = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [navigationBarOpen, setNavigationBarOpen] = useState(
      !(window.innerWidth < 1200)
    );
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  
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


return (
    <>
    <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />

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
          <div className={styles.profileContainer}>
            <div className={styles.leftContainer}>
                <div className={styles.profileItem}>
                    First Name
                </div>
                <div className={styles.profileItem}>
                  <OutlinedInput
                  value={auth.firstName}
                  sx={{ ...grayBorderTextField }}
                  >
                  </OutlinedInput>
                </div>
                <div className={styles.profileItem}>
                    Last Name
                </div>
                <div className={styles.profileItem}>
                <OutlinedInput
                  value={auth.lastName}
                  sx={{ ...grayBorderTextField }}
                  >
                  </OutlinedInput>
                </div>
                <div className={styles.profileItem}>
                  
                    Registered email
                  
                </div>
                <div className={styles.profileItem}>
                <OutlinedInput
                  sx={{ ...grayBorderTextField }}
                  >
                  </OutlinedInput>
                </div>
                <div className={styles.profileItem}>
                <Button
                sx={forestGreenButton}
                variant="contained">
                    Save
                </Button>
                </div>
                <div>
                <Tooltip title="Should be link to PDF or Video" placement="top">
                  <InfoIcon
                    fontSize="small"
                    style={{
                      marginLeft: "8px",
                      color: "#6E6E6E",
                      cursor: "pointer",
                      marginTop: "1.5rem",
                    }}
                  />
                </Tooltip>
                </div>
            </div>
            <div className={styles.profileIcon}>
            <ProfileIcon />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </>
);
}

export default VolunteerProfilePage
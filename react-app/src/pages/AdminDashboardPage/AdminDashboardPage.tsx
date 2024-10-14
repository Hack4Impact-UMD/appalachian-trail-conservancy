import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import styles from "./AdminDashboardPage.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";
import { Button } from "@mui/material";
import {
  forestGreenButtonPadding,
  whiteButtonGrayBorder,
} from "../../muiTheme";

function AdminDashboardPage() {
  const auth = useAuth();
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [trainingsSelected, setTrainingsSelected] = useState<boolean>(true);

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Hello, {auth.firstName}!</h1>
              <div className={styles.adminIcon}>
                <h6> ADMIN </h6>
                <div className={styles.profileIcon}>
                  <ProfileIcon />
                </div>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <Button sx={forestGreenButtonPadding} variant="contained">
                CREATE NEW TRAINING
              </Button>
              <Button sx={forestGreenButtonPadding} variant="contained">
                CREATE NEW PATHWAY
              </Button>
            </div>
            <div className={styles.buttonSelect}>
              <Button
                onClick={() => setTrainingsSelected(true)}
                sx={
                  trainingsSelected
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained"
              >
                TRAINING
              </Button>
              <Button
                onClick={() => setTrainingsSelected(false)}
                sx={
                  !trainingsSelected
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained"
              >
                PATHWAYS
              </Button>
            </div>
            <div className={styles.subHeader}>
              <h2>Recent Drafts</h2>
            </div>
            {trainingsSelected ? (
              <>
                <div className={styles.cardsContainer}>
                  <img
                    src={
                      "https://static.wikia.nocookie.net/cartoons/images/e/ed/Profile_-_SpongeBob_SquarePants.png/revision/latest?cb=20240420115914"
                    }
                    alt="Image"
                  />
                </div>
              </>
            ) : (
              <></>
            )}

            <div className={styles.subHeader}>
              <h2>Recent Published</h2>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AdminDashboardPage;

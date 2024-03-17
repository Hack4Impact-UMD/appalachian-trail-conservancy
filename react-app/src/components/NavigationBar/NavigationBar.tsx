import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../backend/AuthFunctions";
import styles from "./NavigationBar.module.css";
import atcprimarylogo from "../../assets/atc-primary-logo.png";
import dashboardActive from "../../assets/dashboardWhite.svg";
import dashboardInactive from "../../assets/dashboardGray.svg";
import completedActive from "../../assets/completedWhite.svg";
import completedInactive from "../../assets/completedGray.svg";
import libraryActive from "../../assets/libraryWhite.svg";
import libraryInactive from "../../assets/libraryGray.svg";
import progressActive from "../../assets/progressWhite.svg";
import progressInactive from "../../assets/progressGray.svg";
import logout from "../../assets/logout.svg";

function NavigationBar() {
  // Add Error Handling
  const [submittedError, setSubmittedError] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogOut = (): void => {
    logOut()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.navigationContainer}>
      <div className={styles.logoContainer}>
        <img src={atcprimarylogo} alt="ATC Logo" className={styles.logo} />
      </div>
      <div className={styles.menuItems}>
        <div className={styles.tabContainer}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? `${styles.tab} ${styles.tabActive}`
                : `${styles.tab} ${styles.tabInActive}`
            }
          >
            <div>
              <img
                className={styles.iconActive}
                src={dashboardActive}
                alt="dashboard icon"
              />
              <img
                className={styles.iconInactive}
                src={dashboardInactive}
                alt="dashboard icon"
              />
            </div>
            Dashboard
          </NavLink>
        </div>

        <div className={styles.tabContainer}>
          <NavLink
            to="/trainingLibrary"
            className={({ isActive }) =>
              isActive
                ? `${styles.tab} ${styles.tabActive}`
                : `${styles.tab} ${styles.tabInActive}`
            }
          >
            <div>
              <img
                className={styles.iconActive}
                src={libraryActive}
                alt="library icon"
              />
              <img
                className={styles.iconInactive}
                src={libraryInactive}
                alt="library Icon"
              />
            </div>
            Trainings Library
          </NavLink>
        </div>

        <div className={styles.tabContainer}>
          <NavLink
            to="/trainingsInProgress"
            className={({ isActive }) =>
              isActive
                ? `${styles.tab} ${styles.tabActive}`
                : `${styles.tab} ${styles.tabInActive}`
            }
          >
            <div>
              <img
                className={styles.iconActive}
                src={progressActive}
                alt="loading icon"
              />
              <img
                className={styles.iconInactive}
                src={progressInactive}
                alt="loading Icon"
              />
            </div>
            Trainings in Progress
          </NavLink>
        </div>

        <div className={styles.tabContainer}>
          <NavLink
            to="/trainingsCompleted"
            className={({ isActive }) =>
              isActive
                ? `${styles.tab} ${styles.tabActive}`
                : `${styles.tab} ${styles.tabInActive}`
            }
          >
            <div>
              <img
                className={styles.iconActive}
                src={completedActive}
                alt="completed icon"
              />
              <img
                className={styles.iconInactive}
                src={completedInactive}
                alt="completed Icon"
              />
            </div>
            Trainings Completed
          </NavLink>
        </div>
      </div>
      <div className={styles.logoutContainer}>
        <button
          onClick={() => {
            handleLogOut();
          }}
          className={styles.menuItem}
        >
          <img src={logout} alt="Logout" />
          Log Out
        </button>
      </div>
    </div>
  );
}

export default NavigationBar;

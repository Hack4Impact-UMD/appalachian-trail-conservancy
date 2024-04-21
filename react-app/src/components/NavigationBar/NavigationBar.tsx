import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./NavigationBar.module.css";
import atcprimarylogo from "../../assets/atc-primary-logo.png";
import dashboardActive from "../../assets/dashboardWhite.svg";
import dashboardInactive from "../../assets/dashboardGray.svg";
import trainingsActive from "../../assets/trainingsWhite.svg";
import trainingsInactive from "../../assets/trainingsGray.svg";
import pathwaysActive from "../../assets/pathwaysWhite.svg";
import pathwaysInactive from "../../assets/pathwaysGray.svg";
import achievementsActive from "../../assets/achievementsWhite.svg";
import achievementInactive from "../../assets/achievementsGray.svg";
import logout from "../../assets/logout.svg";
import LogoutPopup from "./LogoutPopup/LogoutPopup";

const NavigationBar = () => {
  const [openLogoutPopup, setOpenLogoutPopup] = useState<boolean>(false);

  const location = useLocation().pathname;

  const handleLogOut = (): void => {
    setOpenLogoutPopup(true);
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
            to="/trainings"
            className={({ isActive }) =>
              isActive || location === "/trainingpage" || location === "/quiz"
                ? `${styles.tab} ${styles.tabActive}`
                : `${styles.tab} ${styles.tabInActive}`
            }
          >
            <div>
              <img
                className={styles.iconActive}
                src={trainingsActive}
                alt="trainings icon"
              />
              <img
                className={styles.iconInactive}
                src={trainingsInactive}
                alt="trainings icon"
              />
            </div>
            Trainings
          </NavLink>
        </div>

        <div className={styles.tabContainer}>
          <NavLink
            to="/pathways"
            className={({ isActive }) =>
              isActive
                ? `${styles.tab} ${styles.tabActive}`
                : `${styles.tab} ${styles.tabInActive}`
            }
          >
            <div>
              <img
                className={styles.iconActive}
                src={pathwaysActive}
                alt="pathways icon"
              />
              <img
                className={styles.iconInactive}
                src={pathwaysInactive}
                alt="pathways icon"
              />
            </div>
            Pathways
          </NavLink>
        </div>

        <div className={styles.tabContainer}>
          <NavLink
            to="/achievements"
            className={({ isActive }) =>
              isActive
                ? `${styles.tab} ${styles.tabActive}`
                : `${styles.tab} ${styles.tabInActive}`
            }
          >
            <div>
              <img
                className={styles.iconActive}
                src={achievementsActive}
                alt="achievements icon"
              />
              <img
                className={styles.iconInactive}
                src={achievementInactive}
                alt="achievements icon"
              />
            </div>
            Achievements
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
      <LogoutPopup open={openLogoutPopup} onClose={setOpenLogoutPopup} />
    </div>
  );
};

export default NavigationBar;

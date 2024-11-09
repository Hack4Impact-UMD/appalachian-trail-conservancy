import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import achievementInactive from "../../assets/achievementsGray.svg";
import achievementsActive from "../../assets/achievementsWhite.svg";
import atcprimarylogo from "../../assets/atc-primary-logo.png";
import collapseArrow from "../../assets/collapseArrow.svg";
import dashboardInactive from "../../assets/dashboardGray.svg";
import dashboardActive from "../../assets/dashboardWhite.svg";
import logout from "../../assets/logout.svg";
import pathwaysInactive from "../../assets/pathwaysGray.svg";
import pathwaysActive from "../../assets/pathwaysWhite.svg";
import trainingsInactive from "../../assets/trainingsGray.svg";
import trainingsActive from "../../assets/trainingsWhite.svg";
import LogoutPopup from "./LogoutPopup/LogoutPopup";
import styles from "./NavigationBar.module.css";

interface NavigationBarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ open, setOpen }) => {
  const [openLogoutPopup, setOpenLogoutPopup] = useState<boolean>(false);

  const handleLogOut = (): void => {
    setOpenLogoutPopup(true);
  };

  // Automatically close NavBar when window width is below 1200px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200 && open) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [open, setOpen]);

  return (
    <div
      className={`${styles.navigationContainer} ${open ? "" : styles.closed} ${
        openLogoutPopup ? styles.popupOpen : ""
      }`}
    >
      {open ? (
        <>
          <div className={styles.logoContainer}>
            <img src={atcprimarylogo} alt="ATC Logo" className={styles.logo} />
          </div>
          <div className={styles.menuItems}>
            <div className={styles.navigationContainer}>
              <div className={styles.arrowBox}>
                <img
                  src={collapseArrow}
                  className={styles.collapseArrow}
                  width={20}
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className={styles.logoContainer}>
                <img
                  src={atcprimarylogo}
                  alt="ATC Logo"
                  className={styles.logo}
                />
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
                      isActive
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
            </div>
          </div>
          <LogoutPopup open={openLogoutPopup} onClose={setOpenLogoutPopup} />
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default NavigationBar;

import React from "react";
import { NavLink } from "react-router-dom";
import "./NavigationBar.css";
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

interface NavigationProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Navigation: React.FunctionComponent<NavigationProps> = ({
  activeItem,
  onItemClick,
}) => {
  const handleItemClick = (item: string) => {
    if (activeItem !== item) {
      onItemClick(item);
    }
  };

  return (
    <div className="navigation-container">
      <div className="logo-container">
        <img src={atcprimarylogo} alt="Hack4Impact Logo" className="logo" />
      </div>
      <div className="menu-items">
        <div className="tab-container">
          <NavLink to="/" className="nav-link">
            <div
              className={`tab ${
                activeItem === "Dashboard" ? "active" : "inactive"
              }`}
              onClick={() => handleItemClick("Dashboard")}
            >
              <img
                className="icon"
                src={
                  activeItem === "Dashboard"
                    ? dashboardActive
                    : dashboardInactive
                }
                alt="Dashboard Icon"
              />
              Dashboard
            </div>
          </NavLink>
        </div>

        <div className="tab-container">
          <NavLink to="/" className="nav-link">
            <div
              className={`tab ${
                activeItem === "Library" ? "active" : "inactive"
              }`}
              onClick={() => handleItemClick("Library")}
            >
              <img
                className="icon"
                src={activeItem === "Library" ? libraryActive : libraryInactive}
                alt="Library Icon"
              />
              Trainings Library
            </div>
          </NavLink>
        </div>

        <div className="tab-container">
          <NavLink to="/" className="nav-link">
            <div
              className={`tab ${
                activeItem === "Progress" ? "active" : "inactive"
              }`}
              onClick={() => handleItemClick("Progress")}
            >
              <img
                className="icon"
                src={
                  activeItem === "Progress" ? progressActive : progressInactive
                }
                alt="Progress Icon"
              />
              Trainings in Progress
            </div>
          </NavLink>
        </div>

        <div className="tab-container">
          <NavLink to="/" className="nav-link">
            <div
              className={`tab ${
                activeItem === "Completed" ? "active" : "inactive"
              }`}
              onClick={() => handleItemClick("Completed")}
            >
              <img
                className="icon"
                src={
                  activeItem === "Completed"
                    ? completedActive
                    : completedInactive
                }
                alt="Completed Icon"
              />
              Trainings Completed
            </div>
          </NavLink>
        </div>
      </div>
      <div className="logout-container">
        <button
          onClick={() => console.log("Logout clicked")}
          className="menu-item"
        >
          <img src={logout} alt="Logout" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Navigation;

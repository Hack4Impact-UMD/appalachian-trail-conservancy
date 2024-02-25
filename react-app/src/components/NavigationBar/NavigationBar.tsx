import React from "react";
import "./NavigationBar.css";
import hack4impactLogo from "../../assets/hack4impact_logo.jpg"; // Importing the logo image

interface NavigationProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Navigation: React.FunctionComponent<NavigationProps> = ({
  activeItem,
  onItemClick,
}) => {
  const handleItemClick = (item: string) => {
    onItemClick(item);
  };

  return (
    <div className="navigation-container">
      <div className="logo-container">
        <img src={hack4impactLogo} alt="Hack4Impact Logo" className="logo" />{" "}
      </div>
      <div className="menu-items">
        <a href="#">
          <div
            className="menu-item"
            onClick={() => handleItemClick("Dashboard")}
          >
            Dashboard
          </div>
        </a>
        <a href="#">
          <div
            className="menu-item"
            onClick={() => handleItemClick("Training Library")}
          >
            Trainings Library
          </div>
        </a>
        <a href="#">
          <div
            className="menu-item"
            onClick={() => handleItemClick("Training in Progress")}
          >
            Trainings in Progress
          </div>
        </a>
        <a href="#">
          <div
            className="menu-item"
            onClick={() => handleItemClick("Training Completed")}
          >
            Trainings Completed
          </div>
        </a>
      </div>
      <div className="logout-container">
        <button
          onClick={() => console.log("Logout clicked")}
          className="menu-item"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Navigation;

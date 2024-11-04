import { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import styles from "./AdminUserManagement.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { borderColor, styled } from "@mui/system";

function AdminUserManagement() {
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [alignment, setAlignment] = useState<string | null>("user");
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const CustomToggleButtonGroup = styled(ToggleButtonGroup)({
    borderRadius: "15px", // Rounded corners
    border: "1px solid black",
    overflow: "hidden", // Ensures rounded corners display correctly
  });

  const CustomToggleButton = styled(ToggleButton)({
    flex: 1,
    padding: "20px 40px",
    color: "black",
    fontWeight: "bold",
    fontSize: "0.85rem",
    whiteSpace: "nowrap", // Prevent text from wrapping
    overflow: "hidden",
    borderColor: "black",
    border: "1px solid",
    borderRight: "2px solid black",
    "&.Mui-selected": {
      backgroundColor: "#a29fbf", // steel purple but idk how to make it use var(--steel-purple)
      color: "white",
      borderColor: "black",
    },
    "&:not(.Mui-selected)": {
      backgroundColor: "white", // White for unselected button
    },
    "&:hover": {
      backgroundColor: "#a29fbf", // again steel purple
    },
    "&:first-of-type": {
      borderRadius: "15px 0 0 15px", // Rounded left
    },
    "&:last-of-type": {
      borderRadius: "0 15px 15px 0", // Rounded right
      borderRight: "none",
    },
  });

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
              <h1 className={styles.nameHeading}>Data Management Portal</h1>
              <ProfileIcon />
            </div>
            <div className={styles.buttonGroup}>
              <CustomToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
              >
                <CustomToggleButton value="user">
                  USER INFORMATION
                </CustomToggleButton>
                <CustomToggleButton value="training">
                  TRAINING INFORMATION
                </CustomToggleButton>
                <CustomToggleButton value="pathways">
                  PATHWAYS INFORMATION
                </CustomToggleButton>
              </CustomToggleButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminUserManagement;

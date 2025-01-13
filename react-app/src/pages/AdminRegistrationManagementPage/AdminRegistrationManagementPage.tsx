import { useState, useRef, useEffect } from "react";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar.tsx";
import EditRegistrationCode from "./SubComponents/EditRegistrationCode.tsx";
import EditEmail from "./SubComponents/EditEmail.tsx";
import { FormControl, MenuItem, Select } from "@mui/material";
import styles from "./AdminRegistrationManagementPage.module.css";
import {
  CustomToggleButtonGroup,
  PurpleToggleButton,
  whiteSelectGrayBorder,
  selectOptionStyle,
} from "../../muiTheme.ts";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import hamburger from "../../assets/hamburger.svg";
import Quill from "quill";

function AdminRegistrationManagementPage() {
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const quillRef = useRef<Quill | null>(null);
  const [tab, setTab] = useState<string | null>("user");

  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTabChange = (newTab: string | null) => {
    if (newTab !== null) {
      setTab(newTab);
      quillRef.current = null;
    }
  };

  return (
    <>
      <AdminNavigationBar
        open={navigationBarOpen}
        setOpen={setNavigationBarOpen}
      />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}
      >
        {!navigationBarOpen && (
          <img
            src={hamburger}
            alt="Hamburger Menu"
            className={styles.hamburger}
            width={30}
            onClick={() => setNavigationBarOpen(true)}
          />
        )}
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Registration Management</h1>
              <ProfileIcon />
            </div>
            <div className={styles.mainContainer}>
              <div className={styles.innerMainContainer}>
                <div className={styles.buttonGroup}>
                  <CustomToggleButtonGroup
                    value={tab}
                    exclusive
                    onChange={(event, value) => handleTabChange(value)}
                  >
                    <PurpleToggleButton value="user">
                      EDIT NEW USER EMAIL
                    </PurpleToggleButton>
                    <PurpleToggleButton value="registration">
                      REGISTRATION CODE
                    </PurpleToggleButton>
                  </CustomToggleButtonGroup>
                </div>
                {/* dropdown container */}
                <div className={styles.dropdownContainer}>
                  <FormControl sx={{ width: 300 }}>
                    <Select
                      className={styles.dropdownMenu}
                      sx={whiteSelectGrayBorder}
                      value={tab}
                      onChange={(e) => handleTabChange(e.target.value)} // Handle the dropdown value directly
                      displayEmpty
                      label="Filter"
                    >
                      <MenuItem value="user" sx={selectOptionStyle}>
                        EDIT NEW USER EMAIL
                      </MenuItem>
                      <MenuItem value="registration" sx={selectOptionStyle}>
                        REGISTRATION CODE
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className={styles.emailRegCodeContainer}>
                  {tab === "user" ? (
                    <EditEmail tab={tab} quillRef={quillRef} />
                  ) : (
                    <EditRegistrationCode />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AdminRegistrationManagementPage;

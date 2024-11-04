import { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import styles from "./AdminUserManagement.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import { IoIosSearch } from "react-icons/io";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
import { User } from "../../types/UserType.ts";
import { DataGrid } from "@mui/x-data-grid";
import {
  forestGreenButtonPadding,
  forestGreenButtonLarge,
  whiteButtonGrayBorder,
  grayBorderSearchBar,
} from "../../muiTheme";
import debounce from "lodash.debounce";
import { borderColor, styled } from "@mui/system";

function AdminUserManagement() {
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [alignment, setAlignment] = useState<string | null>("user");
  const [searchQuery, setSearchQuery] = useState("");
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const [user1] = useState<User>({
    auth_id: "U6ICu0t0MxOuUCygwXY7aLeJCCv2",
    email: "sophietsai31@gmail.com",
    firstName: "Sophie",
    lastName: "Tsai",
    type: "ADMIN"
  });

  const [user2] = useState<User>({
    auth_id: "wZO7L1uS1dc9YIrq7FU6YXzZk1J3",
    email: "h4iatctest@gmail.com",
    firstName: "Akash",
    lastName: "Patil",
    type: "VOLUNTEER"
  });

  const users = [user1, user2];

  const columns = [
    { field: "auth_id", headerName: "Auth ID", width: 250 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "type", headerName: "User Type", width: 120 }
  ];

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

  const DataGridStyles = {
    border: 10,
    borderColor: "rgba(189,189,189,0.75)",
    borderRadius: 4,
    "& .MuiDataGrid-row:nth-child(even)": {
      backgroundColor: "rgba(224, 224, 224, 0.75)",
      fontFamily: `"Source-Serif 4", serif`,
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#2264E555",
      borderRadius: 0,
      fontFamily: `"Source-Serif 4", serif`,
    },
    "& .MuiDataGrid-row:nth-child(odd)": {
      backgroundColor: "#FFFFFF",
      fontFamily: `"Source-Serif 4", serif`,
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: "rgba(224, 224, 224, 0.75)",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "#2264E535",
      cursor: "pointer",
    },
  };

  const updateQuery = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setSearchQuery(e.target.value);

  const debouncedOnChange = debounce(updateQuery, 200);

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
            {/* Conditional Content Rendering */}
            <div className={styles.contentSection}>
              {alignment === "user" && (
                <div>
                  <div className={styles.searchBarContainer}>
                    <OutlinedInput
                      sx={grayBorderSearchBar}
                      placeholder="Search..."
                      onChange={debouncedOnChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <IoIosSearch />
                        </InputAdornment>
                      }
                    />
                  </div>
                  <div className={styles.innerGrid}>
                    <DataGrid
                      rows={users}
                      columns={columns}
                      columnHeaderHeight={50}
                      rowHeight={40}
                      disableRowSelectionOnClick
                      onRowClick={(row) => {
                      }}
                      sx={DataGridStyles}
                    />
                  </div>
                  <h2>User Information</h2>
                  <p>Details about user information go here.</p>
                </div>
              )}
              {alignment === "training" && (
                <div>
                  <h2>Training Information</h2>
                  <p>Details about training information go here.</p>
                </div>
              )}
              {alignment === "pathways" && (
                <div>
                  <h2>Pathways Information</h2>
                  <p>Details about pathways information go here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminUserManagement;

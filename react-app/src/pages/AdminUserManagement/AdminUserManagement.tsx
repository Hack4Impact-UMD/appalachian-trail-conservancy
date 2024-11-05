import { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import styles from "./AdminUserManagement.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import { IoIosSearch } from "react-icons/io";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
import { User } from "../../types/UserType.ts";
import { DataGrid } from "@mui/x-data-grid";
import Footer from "../../components/Footer/Footer";
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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
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

  const users = [
    { id: user1.auth_id, ...user1 },
    { id: user2.auth_id, ...user2 }
  ];

  const columns = [
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "misc", headerName: "Miscellaneous", width: 200 }
  ];

  const CustomToggleButtonGroup = styled(ToggleButtonGroup)({
    width: "100%",
    borderRadius: "15px", // Rounded corners
    border: "2px solid black",
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
    borderWidth: "0 2px", // Only right and left borders
    borderStyle: "solid",
    "&.Mui-selected": {
      backgroundColor: "#a29fbf", // steel purple but idk how to make it use var(--steel-purple)
      color: "white",
    },
    "&:not(.Mui-selected)": {
      backgroundColor: "white", // White for unselected button
    },
    "&:hover": {
      backgroundColor: "#a29fbf", // again steel purple
    },
    "&:first-of-type": {
      borderLeft: "none", // Remove left border for the first button
    },
    "&:last-of-type": {
      borderRight: "none", // Remove right border for the last button
    },
    "&:not(:first-of-type)": {
      borderLeft: "2px solid black", // Add left border for buttons after the first
    },
  });

  const DataGridStyles = {
    border: 2,
    borderColor: "rgba(38, 56, 67, 1)",
    borderRadius: 4,
    overflow: "hidden",
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "rgba(10, 118, 80, 1)",
      color: "white",
      fontWeight: "bold",
      borderBottom: "2px solid black",
      display: "flex",
      "& .MuiDataGrid-columnHeader": {
        display: 'flex',
        alignItems: 'center', // Align items vertically
        justifyContent: 'space-between',
        padding: '0, 4px', // Adjust padding for uniformity
        minWidth: 150, // Set minimum width
        position: 'relative', // Ensure relative positioning
      },
      "& .MuiDataGrid-columnSeparator": {
        visibility: "visible",
      },
    },
    "& .MuiDataGrid-menuIcon": {
      visibility: "visible",
      opacity: 1,
      padding: "0", 
      pointerEvents: "auto",
      position: "relative", // Absolute positioning within the header
      right: "12px", // Fine-tuned right positioning
      top: "50%", // Center it vertically
      transform: "translateY(-50%)", // Adjust to center vertically
      height: "24px", // Fixed height for icon
      width: "24px", // Fixed width for icon
    },
    "& .MuiDataGrid-row": {
      borderBottom: "2px solid black",
    },
    "& .MuiDataGrid-row:nth-child(even)": {
      backgroundColor: "rgba(217, 217, 217, 1)",
    },
    "& .MuiDataGrid-row:nth-child(odd)": {
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: "rgba(224, 224, 224, 0.75)",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "#E0F5E0",
      cursor: "pointer",
      "& .MuiDataGrid-cell": {
        textDecoration: "underline",
      },
    },
    "& .MuiCheckbox-root": {
      "&.Mui-checked": {
        color: "rgba(10, 118, 80, 1)",
      },
    },
    "& .MuiDataGrid-row.Mui-selected": {
      "&:hover": {
        backgroundColor: "#E0F5E0",
        textDecoration: "underline",
      },
    },
  };

  const filterUsers = () => {
    let filtered = searchQuery ? users.filter((user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    ) : users; // Show all users if searchQuery is empty

    setFilteredUsers(filtered);
  };

  const updateQuery = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };

  const debouncedOnChange = debounce(updateQuery, 200);

  useEffect(() => {
    filterUsers(); // Filter users whenever the searchQuery changes
  }, [searchQuery]);

  useEffect(() => {
    setFilteredUsers(users); // Initialize filteredUsers with all users
  }, []);

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
                      rows={filteredUsers}
                      columns={columns}
                      rowHeight={40}
                      autoHeight
                      checkboxSelection
                      sx={DataGridStyles}
                      onRowClick={(row) => {
                      }}
                    />
                  </div>
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
        <Footer />
      </div>
    </>
  );
}

export default AdminUserManagement;

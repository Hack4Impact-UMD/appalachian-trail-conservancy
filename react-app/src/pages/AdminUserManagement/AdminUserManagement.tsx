import { useEffect, useState } from "react";
import styles from "./AdminUserManagement.module.css";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
import { User } from "../../types/UserType.ts";
import {
  DataGrid,
  GridColumnMenuProps,
  GridColumnMenuContainer,
  GridFilterMenuItem,
  SortGridMenuItems,
} from "@mui/x-data-grid";
import { IoIosSearch } from "react-icons/io";
import { TbArrowsSort } from "react-icons/tb";
import {
  grayBorderSearchBar,
  CustomToggleButtonGroup,
  PurpleToggleButton,
  whiteButtonOceanGreenBorder,
  DataGridStyles,
} from "../../muiTheme";
import debounce from "lodash.debounce";
import hamburger from "../../assets/hamburger.svg";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";

function AdminUserManagement() {
  const [alignment, setAlignment] = useState<string | null>("user");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
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
    type: "ADMIN",
  });

  const [user2] = useState<User>({
    auth_id: "wZO7L1uS1dc9YIrq7FU6YXzZk1J3",
    email: "h4iatctest@gmail.com",
    firstName: "Akash",
    lastName: "Patil",
    type: "VOLUNTEER",
  });

  const users = [
    { id: user1.auth_id, ...user1 },
    { id: user2.auth_id, ...user2 },
    { id: 2, ...user2 },
    { id: 3, ...user2 },
    { id: 4, ...user2 },
    { id: 5, ...user2 },
    { id: 6, ...user2 },
    { id: 7, ...user2 },
    { id: 8, ...user2 },
    { id: 9, ...user2 },
    { id: 10, ...user2 },
    { id: 11, ...user2 },
  ];
  const columns = [
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "misc", headerName: "Miscellaneous", width: 200 },
  ];

  const filterUsers = () => {
    let filtered = searchQuery
      ? users.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : users; // Show all users if searchQuery is empty
    setFilteredUsers(filtered);
  };

  const CustomColumnMenu = (props: GridColumnMenuProps) => {
    const { hideMenu, currentColumn, open } = props;

    return (
      <GridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        open={open}>
        <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />
        <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />
      </GridColumnMenuContainer>
    );
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
      <AdminNavigationBar
        open={navigationBarOpen}
        setOpen={setNavigationBarOpen}
      />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{
          // Only apply left shift when screen width is greater than 1200px
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}>
        {!navigationBarOpen && (
          <img
            src={hamburger}
            alt="Hamburger Menu"
            className={styles.hamburger} // Add styles to position it
            width={30}
            onClick={() => setNavigationBarOpen(true)} // Set sidebar open when clicked
          />
        )}
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
                onChange={handleAlignment}>
                <PurpleToggleButton value="user">
                  USER INFORMATION
                </PurpleToggleButton>
                <PurpleToggleButton value="training">
                  TRAINING INFORMATION
                </PurpleToggleButton>
                <PurpleToggleButton value="pathways">
                  PATHWAYS INFORMATION
                </PurpleToggleButton>
              </CustomToggleButtonGroup>
            </div>
            {/* Conditional Content Rendering */}
            <div className={styles.contentSection}>
              {alignment === "user" && (
                <>
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
                    <Button
                      sx={{
                        ...whiteButtonOceanGreenBorder,
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        fontWeight: "bold",
                      }}>
                      Export
                    </Button>
                  </div>

                  <div className={styles.innerGrid}>
                    <DataGrid
                      rows={filteredUsers}
                      columns={columns}
                      rowHeight={40}
                      autoHeight
                      checkboxSelection
                      pageSize={10}
                      sx={DataGridStyles}
                      components={{
                        ColumnUnsortedIcon: TbArrowsSort,
                        ColumnMenu: CustomColumnMenu,
                      }}
                      onRowClick={(row) => {}}
                    />
                  </div>
                </>
              )}
              {alignment === "training" && (
                <>
                  <h2>Training Information</h2>
                  <p>Details about training information go here.</p>
                </>
              )}
              {alignment === "pathways" && (
                <>
                  <h2>Pathways Information</h2>
                  <p>Details about pathways information go here.</p>
                </>
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

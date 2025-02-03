import { useEffect, useState } from "react";
import styles from "./AdminUserManagement.module.css";
import {
  Button,
  InputAdornment,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import {
  getVolunteers,
  getAllTrainings,
  getAllPathways,
} from "../../backend/FirestoreCalls";
import {
  managementVolunteerType,
  managementTrainingType,
  managementPathwayType,
  parseVolunteerData,
  parseTrainingData,
  parsePathwayData,
  usersColumns,
  pathwaysColumns,
  trainingsColumns,
  exportVolunteerData,
  exportTrainingData,
  exportPathwayData,
} from "./helpers.ts";
import {
  DataGrid,
  GridRowId,
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
  whiteSelectGrayBorder,
  selectOptionStyle,
} from "../../muiTheme";
import debounce from "lodash.debounce";
import hamburger from "../../assets/hamburger.svg";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";

function AdminUserManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [errorFetching, setErrorFetching] = useState<boolean>(false);

  const [alignment, setAlignment] = useState<string>("user");

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [filteredUsers, setFilteredUsers] = useState<managementVolunteerType[]>(
    []
  );
  const [usersData, setUsersData] = useState<managementVolunteerType[]>([]);

  const [filteredTrainings, setFilteredTrainings] = useState<
    managementTrainingType[]
  >([]);
  const [trainingsData, setTrainingsData] = useState<managementTrainingType[]>(
    []
  );

  const [filteredPathways, setFilteredPathways] = useState<
    managementPathwayType[]
  >([]);
  const [pathwaysData, setPathwaysData] = useState<managementPathwayType[]>([]);

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

  const handleAlignment = (newAlignment: string | null) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      setSearchQuery(""); // Reset search query

      // Reset filtered data based on the selected table
      if (newAlignment === "user") {
        setFilteredUsers(usersData);
      } else if (newAlignment === "training") {
        setFilteredTrainings(trainingsData);
      } else if (newAlignment === "pathways") {
        setFilteredPathways(pathwaysData);
      }
    }
  };

  useEffect(() => {
    if (location.state?.fromPage === "pathway") {
      setAlignment("pathways");
    } else if (location.state?.fromPage === "training") {
      setAlignment("training");
    }
  }, [location.state]);

  useEffect(() => {
    setLoading(true);
    const fetchInitialData = async () => {
      try {
        const users = await getVolunteers();
        const trainings = await getAllTrainings();
        const pathways = await getAllPathways();

        // Parse the volunteer data for the data table
        const parsedUsers = parseVolunteerData(users);
        setUsersData(parsedUsers);
        setFilteredUsers(parsedUsers);

        // Filter out draft trainings and pathways
        const parsedTrainings = parseTrainingData(trainings, users);
        setTrainingsData(parsedTrainings);
        setFilteredTrainings(parsedTrainings);

        const parsedPathways = parsePathwayData(pathways, users);
        setPathwaysData(parsedPathways);
        setFilteredPathways(parsedPathways);
      } catch (e) {
        console.error("Error fetching initial data:", e);
        setErrorFetching(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const filterUsers = () => {
    let filtered = searchQuery
      ? usersData.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : usersData; // Show all users if searchQuery is empty
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

  const filterTrainings = () => {
    const filtered = searchQuery
      ? trainingsData.filter((training) =>
          training.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : trainingsData; // Show all trainings if searchQuery is empty
    setFilteredTrainings(filtered);
  };

  const filterPathways = () => {
    const filtered = searchQuery
      ? pathwaysData.filter((pathway) =>
          pathway.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : pathwaysData; // Show all pathways if searchQuery is empty
    setFilteredPathways(filtered);
  };

  // Apply the appropriate filter based on the active tab and search query
  useEffect(() => {
    setSearchQuery(""); // Clear the search query when the table is switched
    if (alignment === "user") {
      filterUsers();
    } else if (alignment === "training") {
      filterTrainings();
    } else if (alignment === "pathways") {
      filterPathways();
    }
  }, [alignment]); // Trigger this effect whenever `alignment` changes

  const handleSearchChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setSearchQuery(value); // Update the state immediately for the input field
    debouncedFilter(value); // Apply the filter logic with debounce
  };

  // Debounced filter logic
  const debouncedFilter = debounce((value: string) => {
    if (alignment === "user") {
      setFilteredUsers(
        value
          ? usersData.filter(
              (user) =>
                user.firstName.toLowerCase().includes(value.toLowerCase()) ||
                user.lastName.toLowerCase().includes(value.toLowerCase()) ||
                user.email.toLowerCase().includes(value.toLowerCase())
            )
          : usersData
      );
    } else if (alignment === "training") {
      setFilteredTrainings(
        value
          ? trainingsData.filter((training) =>
              training.name.toLowerCase().includes(value.toLowerCase())
            )
          : trainingsData
      );
    } else if (alignment === "pathways") {
      setFilteredPathways(
        value
          ? pathwaysData.filter((pathway) =>
              pathway.name.toLowerCase().includes(value.toLowerCase())
            )
          : pathwaysData
      );
    }
  }, 200); // Debounce interval in milliseconds

  useEffect(() => {
    return () => {
      debouncedFilter.cancel();
    };
  }, []);

  useEffect(() => {
    filterUsers(); // Filter users whenever the searchQuery changes
  }, [searchQuery]);

  useEffect(() => {
    setFilteredUsers(usersData); // Initialize filteredUsers with all users
  }, []);

  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);

  useEffect(() => {
    // Clear the selection whenever the table (alignment) changes
    setSelectionModel([]);
  }, [alignment]);

  // Delete user snackbar
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  useEffect(() => {
    if (location.state?.showSnackbar) {
      setOpenSnackbar(true);
    }
  }, [location.state]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setOpenSelectSnackbar(false);
  };

  const [openSelectSnackbar, setOpenSelectSnackbar] = useState<boolean>(false);
  const exportData = () => {
    // Reset the snackbar
    setOpenSelectSnackbar(false);

    // Check if any row is selected
    if (selectionModel.length === 0) {
      setOpenSelectSnackbar(true);
      return;
    }

    if (alignment === "user") {
      exportVolunteerData(selectionModel, filteredUsers);
    } else if (alignment === "training") {
      exportTrainingData(selectionModel, filteredTrainings);
    } else {
      exportPathwayData(selectionModel, filteredPathways);
    }
  };

  // Conditional rendering of the table based on the active tab
  const table = () => {
    if (alignment === "user") {
      return (
        <DataGrid
          rows={filteredUsers}
          columns={usersColumns}
          rowHeight={40}
          checkboxSelection
          pageSize={10}
          sx={DataGridStyles}
          components={{
            ColumnUnsortedIcon: TbArrowsSort,
            ColumnMenu: CustomColumnMenu,
          }}
          onRowClick={(row) => {
            navigate(`/management/volunteer/${row.id}`);
          }}
          getRowId={(row) => row.id} // Use id as the unique ID for each row
          selectionModel={selectionModel} // Controlled selection model
          onSelectionModelChange={(newSelection) =>
            setSelectionModel(newSelection)
          }
        />
      );
    } else if (alignment === "training") {
      return (
        <DataGrid
          rows={filteredTrainings}
          columns={trainingsColumns}
          rowHeight={40}
          checkboxSelection
          pageSize={10}
          sx={DataGridStyles}
          components={{
            ColumnUnsortedIcon: TbArrowsSort,
            ColumnMenu: CustomColumnMenu,
          }}
          onRowClick={(row) => {
            navigate(`/management/training/${row.id}`);
          }}
          selectionModel={selectionModel} // Controlled selection model
          onSelectionModelChange={(newSelection) =>
            setSelectionModel(newSelection)
          }
        />
      );
    } else {
      return (
        <DataGrid
          rows={filteredPathways}
          columns={pathwaysColumns}
          rowHeight={40}
          checkboxSelection
          pageSize={10}
          sx={DataGridStyles}
          components={{
            ColumnUnsortedIcon: TbArrowsSort,
            ColumnMenu: CustomColumnMenu,
          }}
          onRowClick={(row) => {
            navigate(`/management/pathway/${row.id}`);
          }}
          selectionModel={selectionModel} // Controlled selection model
          onSelectionModelChange={(newSelection) =>
            setSelectionModel(newSelection)
          }
        />
      );
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
              <div className={styles.profileIcon}>
                <ProfileIcon />
              </div>
            </div>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className={styles.buttonGroup}>
                  <CustomToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={(event, newAlignment) =>
                      handleAlignment(newAlignment)
                    }>
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
                {/* dropdown container */}
                <div className={styles.dropdownContainer}>
                  <FormControl sx={{ width: 300 }}>
                    <Select
                      className={styles.dropdownMenu}
                      sx={whiteSelectGrayBorder}
                      value={alignment}
                      onChange={(e) => handleAlignment(e.target.value)} // Handle the dropdown value directly
                      displayEmpty
                      label="Filter">
                      <MenuItem value="user" sx={selectOptionStyle}>
                        USER INFORMATION
                      </MenuItem>
                      <MenuItem value="training" sx={selectOptionStyle}>
                        TRAINING INFORMATION
                      </MenuItem>
                      <MenuItem value="pathways" sx={selectOptionStyle}>
                        PATHWAYS
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {/* Conditional Content Rendering */}
                {errorFetching ? (
                  <div>
                    <h2 className={styles.errorText}>
                      Error fetching data. Please try again later.
                    </h2>
                  </div>
                ) : (
                  <div className={styles.contentSection}>
                    <div className={styles.searchBarContainer}>
                      <OutlinedInput
                        className={styles.searchBar}
                        sx={grayBorderSearchBar}
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        startAdornment={
                          <InputAdornment position="start">
                            <IoIosSearch />
                          </InputAdornment>
                        }
                      />
                      <Button
                        className={styles.export}
                        sx={whiteButtonOceanGreenBorder}
                        onClick={exportData}>
                        Export
                      </Button>
                    </div>

                    <div className={styles.innerGrid}>{table()}</div>
                  </div>
                )}

                <div className={styles.snackbarContainer}>
                  {/* No row selected alert */}
                  <Snackbar
                    open={openSelectSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position within the right section
                  >
                    <Alert onClose={handleCloseSnackbar} severity="warning">
                      Please select rows to export.
                    </Alert>
                  </Snackbar>

                  {/* Delete volunteer alert */}
                  <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position within the right section
                  >
                    <Alert onClose={handleCloseSnackbar} severity="success">
                      Volunteer successfully deleted.
                    </Alert>
                  </Snackbar>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AdminUserManagement;

import { useEffect, useState } from "react";
import styles from "./AdminVolunteerDetailsPage.module.css";
import {
  Button,
  InputAdornment,
  OutlinedInput,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  VolunteerID,
  VolunteerPathway,
  VolunteerTraining,
} from "../../types/UserType.ts";
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
  whiteButtonOceanGreenBorder,
  DataGridStyles,
  whiteButtonGrayBorder,
  forestGreenButtonPadding,
  whiteButtonRedBorder,
  whiteSelectGrayBorder,
  selectOptionStyle,
} from "../../muiTheme.ts";
import debounce from "lodash.debounce";
import hamburger from "../../assets/hamburger.svg";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar.tsx";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import { DateTime } from "luxon";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getPathway,
  getTraining,
  getVolunteer,
} from "../../backend/FirestoreCalls.ts";
import { exportTableToCSV } from "../../backend/AdminFirestoreCalls.ts";
import { TrainingID } from "../../types/TrainingType.ts";
import { PathwayID } from "../../types/PathwayType.ts";
import DeleteUserPopup from "./AdminDeleteUserPopup/AdminDeleteUserPopup.tsx";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import {
  quizScoreComparator,
  passFailComparator,
} from "../AdminUserManagementPage/helpers.ts";

function AdminVolunteerDetailsPage() {
  const navigate = useNavigate();

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };
  const volunteerId = useParams().id;
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [alignment, setAlignment] = useState<string>("trainings");
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [trainings, setTrainings] = useState<
    { training: TrainingID; volunteerTraining: VolunteerTraining }[]
  >([]);
  const [filteredTrainings, setFilteredTrainings] = useState<
    { training: TrainingID; volunteerTraining: VolunteerTraining }[]
  >([]);

  const [pathways, setPathways] = useState<
    { pathway: PathwayID; volunteerPathway: VolunteerPathway }[]
  >([]);
  const [filteredPathways, setFilteredPathways] = useState<
    { pathway: PathwayID; volunteerPathway: VolunteerPathway }[]
  >([]);

  const [numTrainingsCompleted, setNumTrainingsCompleted] = useState<number>(0);
  const [numPathwaysCompleted, setNumPathwaysCompleted] = useState<number>(0);

  const [volunteer, setVolunteer] = useState<VolunteerID>({
    id: "",
    trainingInformation: [],
    pathwayInformation: [],
    auth_id: "",
    email: "",
    firstName: "",
    lastName: "",
    type: "VOLUNTEER",
  });

  const formatDate = (isoDate: string) => {
    if (!isoDate) {
      return "N/A";
    }
    const date = DateTime.fromISO(isoDate);
    return date.isValid ? date.toLocaleString(DateTime.DATE_SHORT) : "N/A";
  };

  const formatTime = (isoDate: string) => {
    if (!isoDate) {
      return "N/A";
    }
    const date = DateTime.fromISO(isoDate);
    return date.isValid ? date.toLocaleString(DateTime.TIME_SIMPLE) : "N/A";
  };

  const formatTrainingsCompleted = (numCompleted: number, numTotal: number) => {
    return `${numCompleted}/${numTotal}`;
  };

  // DataGrid data
  const columns = [
    { field: "trainingName", headerName: "TRAINING", width: 250 },
    { field: "dateCompleted", headerName: "DATE", width: 180 },
    { field: "timeCompleted", headerName: "TIME", width: 180, sortable: false },
    {
      field: "quizScore",
      headerName: "SCORE",
      width: 150,
      sortComparator: quizScoreComparator,
    },
    {
      field: "passFailStatus",
      headerName: "P/F",
      width: 120,
      sortComparator: passFailComparator,
    },
    { field: "status", headerName: "STATUS", width: 130 },
  ];

  const filterTrainings = (
    associatedTrainings: {
      training: TrainingID;
      volunteerTraining: VolunteerTraining;
    }[]
  ) => {
    let filtered = searchQuery
      ? associatedTrainings.filter((training) =>
          training.training.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : associatedTrainings;

    setFilteredTrainings(filtered);
  };

  const filterPathways = (
    associatedPathways: {
      pathway: PathwayID;
      volunteerPathway: VolunteerPathway;
    }[]
  ) => {
    let filtered = searchQuery
      ? associatedPathways.filter((pathway) =>
          pathway.pathway.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : associatedPathways;

    setFilteredPathways(filtered);
  };

  const trainingRows = filteredTrainings.map((currTraining) => {
    const passingScore = currTraining.training.quiz.passingScore;

    return {
      id: currTraining.training.id,
      trainingName: currTraining.training.name,
      dateCompleted: formatDate(currTraining.volunteerTraining.dateCompleted),
      timeCompleted: formatTime(currTraining.volunteerTraining.dateCompleted),
      quizScore:
        currTraining.volunteerTraining.quizScoreRecieved == undefined
          ? "N/A"
          : `${currTraining.volunteerTraining.quizScoreRecieved} / ${currTraining.training.quiz.numQuestions}`,
      passFailStatus:
        currTraining.volunteerTraining.quizScoreRecieved == undefined
          ? "N/A"
          : currTraining.volunteerTraining.quizScoreRecieved >= passingScore
          ? "Passed"
          : "Failed",
      status: currTraining.volunteerTraining.progress,
    };
  });

  const pathwayColumns = [
    { field: "pathwayName", headerName: "NAME", width: 250 },
    { field: "dateCompleted", headerName: "DATE", width: 180 },
    { field: "timeCompleted", headerName: "TIME", width: 180, sortable: false },
    {
      field: "trainingsCompleted",
      headerName: "TRAININGS COMPLETED",
      width: 250,
    },
    {
      field: "score",
      headerName: "SCORE",
      width: 130,
      sortComparator: quizScoreComparator,
    },
    {
      field: "passFailStatus",
      headerName: "P/F",
      width: 120,
      sortComparator: passFailComparator,
    },
    { field: "progress", headerName: "STATUS", width: 180 },
  ];

  const pathwayRows = filteredPathways.map((currPathway) => {
    const passingScore = currPathway.pathway.quiz.passingScore;
    return {
      id: currPathway.pathway.id,
      pathwayName: currPathway.pathway.name,
      dateCompleted: formatDate(currPathway.volunteerPathway.dateCompleted), // Format the date using Luxon
      timeCompleted: formatTime(currPathway.volunteerPathway.dateCompleted),
      trainingsCompleted: formatTrainingsCompleted(
        currPathway.volunteerPathway.numTrainingsCompleted,
        currPathway.volunteerPathway.numTotalTrainings
      ),
      score:
        currPathway.volunteerPathway.quizScoreRecieved == undefined
          ? "N/A"
          : `${currPathway.volunteerPathway.quizScoreRecieved} / ${currPathway.pathway.quiz.numQuestions}`,
      passFailStatus:
        currPathway.volunteerPathway.quizScoreRecieved == undefined
          ? "N/A"
          : currPathway.volunteerPathway.quizScoreRecieved >= passingScore
          ? "Passed"
          : "Failed",
      progress: currPathway.volunteerPathway.progress,
    };
  });

  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [openSelectSnackbar, setOpenSelectSnackbar] = useState<boolean>(false);

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

  const getNumTrainingsCompleted = async (
    volunteerTrainings: VolunteerTraining[]
  ) => {
    let completedTrainings = volunteerTrainings.filter(
      (training) => training.progress == "COMPLETED"
    );
    setNumTrainingsCompleted(completedTrainings.length);
  };

  const getNumPathwaysCompleted = async (
    volunteerPathways: VolunteerPathway[]
  ) => {
    let completedPathways = volunteerPathways.filter(
      (pathway) => pathway.progress == "COMPLETED"
    );
    setNumPathwaysCompleted(completedPathways.length);
  };

  const debouncedOnChange = debounce(updateQuery, 200);

  // associate volunteer trainings with the generic training
  const fetchTrainings = async (volunteerTrainings: VolunteerTraining[]) => {
    try {
      const trainingPromises = volunteerTrainings.map((training) =>
        getTraining(training.trainingID)
      );

      const trainings = await Promise.all(trainingPromises);

      let associatedTrainings: {
        training: TrainingID;
        volunteerTraining: VolunteerTraining;
      }[] = [];

      for (let i = 0; i < trainings.length; i++) {
        associatedTrainings.push({
          training: trainings[i],
          volunteerTraining: volunteerTrainings[i],
        });
      }

      setTrainings(associatedTrainings);
      filterTrainings(associatedTrainings);
    } catch (error) {
      console.log("Failed to get trainings");
    }
  };

  const fetchPathways = async (volunteerPathways: VolunteerPathway[]) => {
    try {
      const pathwayPromises = volunteerPathways.map((pathway) =>
        getPathway(pathway.pathwayID)
      );
      const pathways = await Promise.all(pathwayPromises);
      let associatedPathways: {
        pathway: PathwayID;
        volunteerPathway: VolunteerPathway;
      }[] = [];
      for (let i = 0; i < pathways.length; i++) {
        associatedPathways.push({
          pathway: pathways[i],
          volunteerPathway: volunteerPathways[i],
        });
      }
      setPathways(associatedPathways);
      filterPathways(associatedPathways);
    } catch (error) {
      console.log("Failed to get pathways");
    }
  };

  useEffect(() => {
    if (volunteerId !== undefined && !location.state?.volunteerID) {
      setLoading(true);
      getVolunteer(volunteerId)
        .then(async (volunteerData) => {
          setVolunteer({ ...volunteerData, id: volunteerId });
          getNumTrainingsCompleted(volunteerData.trainingInformation);
          getNumPathwaysCompleted(volunteerData.pathwayInformation);
          fetchTrainings(volunteerData.trainingInformation);
          fetchPathways(volunteerData.pathwayInformation);
        })
        .catch(() => {
          console.log("Failed to get volunteer information");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      if (location.state.volunteerID) {
        setVolunteer(location.state.volunteerID);
      }
      setLoading(false);
    }
  }, [volunteerId, location.state]);

  useEffect(() => {
    filterTrainings(trainings);
    filterPathways(pathways);
  }, [searchQuery]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Clear the selection whenever the table (alignment) changes
    setSelectionModel([]);
  }, [alignment]);

  //delete user popup
  const [openDeleteUserPopup, setOpenDeleteUserPopup] =
    useState<boolean>(false);

  const handleDeleteUser = (): void => {
    setOpenDeleteUserPopup(true);
  };

  const exportTrainingData = () => {
    // Reset the snackbar
    setOpenSelectSnackbar(false);

    // Check if any row is selected
    if (selectionModel.length === 0) {
      setOpenSelectSnackbar(true);
      return;
    }

    const header = columns.map((column) => column.headerName);
    const rowData = selectionModel.map((row) => {
      const training = trainingRows.find((training) => training.id === row);
      if (training) {
        return [
          training.trainingName,
          training.dateCompleted,
          training.timeCompleted,
          training.quizScore,
          training.passFailStatus,
          training.status,
        ];
      }
    });
    exportTableToCSV([header, ...rowData]);
  };

  const exportPathwayData = () => {
    // Reset the snackbar
    setOpenSelectSnackbar(false);

    // Check if any row is selected
    if (selectionModel.length === 0) {
      setOpenSelectSnackbar(true);
      return;
    }

    const header = pathwayColumns.map((column) => column.headerName);
    const rowData = selectionModel.map((row) => {
      const pathway = pathwayRows.find((pathway) => pathway.id === row);
      if (pathway) {
        return [
          pathway.pathwayName,

          pathway.dateCompleted,
          pathway.trainingsCompleted,
          pathway.score,
          pathway.progress,
        ];
      }
    });
    exportTableToCSV([header, ...rowData]);
  };

  return (
    <>
      <div className={openDeleteUserPopup ? styles.popupOpen : ""}>
        <AdminNavigationBar
          open={navigationBarOpen}
          setOpen={setNavigationBarOpen}
        />
      </div>

      <DeleteUserPopup
        open={openDeleteUserPopup}
        onClose={setOpenDeleteUserPopup}
        volunteerAuthId={volunteer.auth_id || ""}
      />

      <div
        className={`${styles.split} ${styles.right} ${
          openDeleteUserPopup ? styles.popupOpen : ""
        }`}
        style={{
          // Only apply left shift when screen width is greater than 1200px
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}>
        {!navigationBarOpen && (
          <img
            src={hamburger}
            alt="Hamburger Menu"
            className={`${styles.hamburger} ${
              openDeleteUserPopup ? styles.popupOpen : ""
            }`} // Add styles to position it
            width={30}
            onClick={() => setNavigationBarOpen(true)} // Set sidebar open when clicked
          />
        )}
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Volunteer Details</h1>
              <div className={styles.profileIcon}>
                <ProfileIcon />
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : (
              <>
                <div className={styles.volunteerInfo}>
                  <div className={styles.text}>
                    <b>Name: </b>
                    {volunteer.firstName} {volunteer.lastName}
                  </div>
                  <div className={styles.text}>
                    <b>Email: </b>
                    {volunteer.email}
                  </div>
                  <br></br>
                  <div className={styles.text}>
                    <b>Training(s) Completed: </b>
                    {numTrainingsCompleted}
                  </div>
                  <div className={styles.text}>
                    <b>Pathways(s) Completed: </b>
                    {numPathwaysCompleted}
                  </div>
                </div>

                <div className={styles.queryContainer}>
                  <div className={styles.searchBarContainer}>
                    <OutlinedInput
                      sx={{ ...grayBorderSearchBar, width: "100%" }}
                      placeholder="Search..."
                      onChange={debouncedOnChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <IoIosSearch />
                        </InputAdornment>
                      }
                    />
                  </div>

                  <div className={styles.buttonGroup}>
                    <Button
                      sx={
                        alignment === "trainings"
                          ? forestGreenButtonPadding
                          : whiteButtonGrayBorder
                      }
                      onClick={(event) => handleAlignment(event, "trainings")}>
                      TRAININGS
                    </Button>
                    <Button
                      sx={
                        alignment === "pathways"
                          ? forestGreenButtonPadding
                          : whiteButtonGrayBorder
                      }
                      onClick={(event) => handleAlignment(event, "pathways")}>
                      PATHWAYS
                    </Button>
                  </div>
                  <div className={styles.dropdownContainer}>
                    <FormControl sx={{ width: 300 }}>
                      <Select
                        className={styles.dropdownMenu}
                        sx={whiteSelectGrayBorder}
                        value={alignment}
                        onChange={(e: any) =>
                          handleAlignment(e, e.target.value)
                        } // Handle the dropdown value directly
                        displayEmpty
                        label="Filter">
                        <MenuItem value="trainings" sx={selectOptionStyle}>
                          TRAININGS
                        </MenuItem>
                        <MenuItem value="pathways" sx={selectOptionStyle}>
                          PATHWAYS
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>

                <div className={styles.contentSection}>
                  {alignment === "trainings" && (
                    <>
                      <div className={styles.innerGrid}>
                        <DataGrid
                          rows={trainingRows}
                          columns={columns}
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
                      </div>
                    </>
                  )}
                  {alignment === "pathways" && (
                    <>
                      <div className={styles.innerGrid}>
                        <DataGrid
                          rows={pathwayRows}
                          columns={pathwayColumns}
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
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.buttonContainer}>
                  <Button
                    className={styles.bottomButton}
                    sx={{
                      ...whiteButtonGrayBorder,
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      width: "100px",
                    }}
                    onClick={() => navigate("/management")}>
                    BACK
                  </Button>
                  <div className={styles.buttonContainerInner}>
                    <Button
                      className={styles.bottomButton}
                      sx={{
                        ...whiteButtonRedBorder,
                        width: "100px",
                      }}
                      onClick={() => {
                        handleDeleteUser();
                      }}>
                      Delete
                    </Button>
                    <Button
                      className={styles.bottomButton}
                      sx={{
                        ...whiteButtonOceanGreenBorder,
                        width: "100px",
                      }}
                      onClick={
                        alignment === "trainings"
                          ? exportTrainingData
                          : exportPathwayData
                      }>
                      Export
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* No row selected alert */}
          <Snackbar
            open={openSelectSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSelectSnackbar(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position within the right section
          >
            <Alert
              onClose={() => setOpenSelectSnackbar(false)}
              severity="warning">
              Please select rows to export.
            </Alert>
          </Snackbar>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AdminVolunteerDetailsPage;

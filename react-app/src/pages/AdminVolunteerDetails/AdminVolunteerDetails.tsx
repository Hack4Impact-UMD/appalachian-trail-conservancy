import { useEffect, useState } from "react";
import styles from "./AdminVolunteerDetails.module.css";
import {
  Button,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import {
  User,
  Volunteer,
  VolunteerID,
  VolunteerPathway,
  VolunteerTraining,
} from "../../types/UserType.ts";
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
  whiteButtonOceanGreenBorder,
  DataGridStyles,
  whiteButtonGrayBorder,
  forestGreenButtonPadding,
  whiteButtonRedBorder,
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
import { TrainingID } from "../../types/TrainingType.ts";
import { PathwayID } from "../../types/PathwayType.ts";
import DeleteUserPopup from "./AdminDeleteUserPopup/AdminDeleteUserPopup.tsx";
import Loading from "../../components/LoadingScreen/Loading.tsx";

function AdminVolunteerDetails() {
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
  const [alignment, setAlignment] = useState<string | null>("trainings");
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
    { field: "timeCompleted", headerName: "TIME", width: 180 },
    { field: "quizScore", headerName: "SCORE", width: 150 },
    { field: "passFailStatus", headerName: "P/F", width: 120 },
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

  const rows = filteredTrainings.map((currTraining) => {
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
    { field: "progress", headerName: "PROGRESS", width: 180 },
    { field: "dateCompleted", headerName: "DATE", width: 180 },
    {
      field: "trainingsCompleted",
      headerName: "TRAININGS COMPLETED",
      width: 250,
    },
    { field: "score", headerName: "SCORE", width: 130 },
  ];

  const pathwayRows = filteredPathways.map((currPathway) => {
    return {
      id: currPathway.pathway.id,
      pathwayName: currPathway.pathway.name,
      progress: currPathway.volunteerPathway.progress,
      dateCompleted: formatDate(currPathway.volunteerPathway.dateCompleted), // Format the date using Luxon
      trainingsCompleted: formatTrainingsCompleted(
        currPathway.volunteerPathway.numTrainingsCompleted,
        currPathway.volunteerPathway.numTotalTrainings
      ),
      score:
        currPathway.volunteerPathway.quizScoreRecieved !== undefined
          ? currPathway.volunteerPathway.quizScoreRecieved
          : "N/A", // Handle score
    };
  });

  const CustomColumnMenu = (props: GridColumnMenuProps) => {
    const { hideMenu, currentColumn, open } = props;

    return (
      <GridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        open={open}
      >
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

  //delete user popup
  const [openDeleteUserPopup, setOpenDeleteUserPopup] =
    useState<boolean>(false);

  const handleDeleteUser = (): void => {
    setOpenDeleteUserPopup(true);
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
        volunteerId={volunteerId || ""}
      />

      <div
        className={`${styles.split} ${styles.right} ${
          openDeleteUserPopup ? styles.popupOpen : ""
        }`}
        style={{
          // Only apply left shift when screen width is greater than 1200px
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}
      >
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
              <ProfileIcon />
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
                      sx={{ ...grayBorderSearchBar, width: "95%" }}
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
                      onClick={(event) => handleAlignment(event, "trainings")}
                    >
                      TRAININGS
                    </Button>
                    <Button
                      sx={
                        alignment === "pathways"
                          ? forestGreenButtonPadding
                          : whiteButtonGrayBorder
                      }
                      onClick={(event) => handleAlignment(event, "pathways")}
                    >
                      PATHWAYS
                    </Button>
                  </div>
                </div>

                <div className={styles.contentSection}>
                  {alignment === "trainings" && (
                    <>
                      <div className={styles.innerGrid}>
                        <DataGrid
                          rows={rows}
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
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.buttonContainer}>
                  <Button
                    sx={{
                      ...whiteButtonGrayBorder,
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      width: "100px",
                    }}
                    onClick={() => navigate("/management")}
                  >
                    BACK
                  </Button>
                  <div className={styles.buttonContainerInner}>
                    <Button
                      sx={{
                        ...whiteButtonRedBorder,
                        width: "100px",
                      }}
                      onClick={() => {
                        handleDeleteUser();
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      sx={{
                        ...whiteButtonOceanGreenBorder,
                        width: "100px",
                      }}
                    >
                      Export
                    </Button>
                  </div>
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

export default AdminVolunteerDetails;

import { useEffect, useState } from "react";
import styles from "./AdminPathwayDetailsPage.module.css";
import {
  Button,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  Alert,
} from "@mui/material";
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
} from "../../muiTheme.ts";
import debounce from "lodash.debounce";
import hamburger from "../../assets/hamburger.svg";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar.tsx";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import { DateTime } from "luxon";
import { PathwayID } from "../../types/PathwayType.ts";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPathway, getTraining } from "../../backend/FirestoreCalls.ts";
import {
  exportTableToCSV,
  getVolunteers,
} from "../../backend/AdminFirestoreCalls.ts";
import { VolunteerID } from "../../types/UserType.ts";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import {
  quizScoreComparator,
  passFailComparator,
} from "../AdminUserManagementPage/helpers.ts";

function AdminPathwayDetailsPage() {
  const navigate = useNavigate();
  const pathwayId = useParams().id;
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    window.innerWidth >= 1200
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [filteredVolunteers, setFilteredVolunteers] = useState<VolunteerID[]>(
    []
  );
  const [showMore, setShowMore] = useState(false);
  const [trainingNames, setTrainingNames] = useState<
    { name: string; id: string }[]
  >([]);
  const [volunteers, setVolunteers] = useState<VolunteerID[]>([]);
  const [pathway, setPathway] = useState<PathwayID>({
    name: "",
    id: "",
    shortBlurb: "",
    description: "",
    coverImage: "",
    trainingIDs: [],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    status: "DRAFT",
  });
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [openSelectSnackbar, setOpenSelectSnackbar] = useState<boolean>(false);

  //formatting date/time with iso
  const formatDate = (isoDate: string) => {
    if (!isoDate) return "N/A";
    const date = DateTime.fromISO(isoDate);
    return date.isValid ? date.toLocaleString(DateTime.DATE_SHORT) : "N/A";
  };

  const formatTime = (isoDate: string) => {
    if (!isoDate) return "N/A";
    const date = DateTime.fromISO(isoDate);
    return date.isValid ? date.toLocaleString(DateTime.TIME_SIMPLE) : "N/A";
  };

  // DataGrid columns
  const columns = [
    { field: "volunteerName", headerName: "NAME", width: 200 },
    { field: "email", headerName: "EMAIL", width: 200 },
    { field: "dateCompleted", headerName: "DATE", width: 200 },
    { field: "timeCompleted", headerName: "TIME", width: 150, sortable: false },
    {
      field: "quizScore",
      headerName: "SCORE",
      width: 150,
      sortComparator: quizScoreComparator,
    },
    {
      field: "passFailStatus",
      headerName: "P/F",
      width: 100,
      sortComparator: passFailComparator,
    },
    { field: "status", headerName: "STATUS", width: 130 },
  ];

  // map the filtered volunteers to rows for DataGrid
  const pathwayRows = filteredVolunteers.flatMap((volunteer) => {
    return volunteer.pathwayInformation
      .filter(
        (volunteerPathway) =>
          volunteerPathway.progress === "INPROGRESS" ||
          volunteerPathway.progress === "COMPLETED"
      )
      .filter((volunteerPathway) => volunteerPathway.pathwayID === pathway.id)
      .map((volunteerPathway) => {
        const passingScore = pathway.quiz.passingScore;
        const quizScore =
          volunteerPathway.quizScoreRecieved === undefined
            ? "N/A"
            : `${volunteerPathway.quizScoreRecieved} / ${pathway.quiz.numQuestions}`;
        const passFailStatus =
          volunteerPathway.quizScoreRecieved === undefined
            ? "N/A"
            : volunteerPathway.quizScoreRecieved >= passingScore
            ? "Passed"
            : "Failed";

        return {
          id: volunteer.id,
          volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
          email: volunteer.email, // Added email field
          dateCompleted: formatDate(volunteerPathway.dateCompleted),
          timeCompleted: formatTime(volunteerPathway.dateCompleted),
          quizScore: quizScore,
          passFailStatus: passFailStatus,
          status: volunteerPathway.progress,
        };
      });
  });

  //search bar
  const filterVolunteers = (associatedVolunteers: VolunteerID[]) => {
    const filtered = searchQuery
      ? associatedVolunteers.filter((volunteer) => {
          const fullName =
            `${volunteer.firstName} ${volunteer.lastName}`.toLowerCase();
          const email = volunteer.email.toLowerCase();

          return (
            (fullName.includes(searchQuery.toLowerCase()) ||
              email.includes(searchQuery.toLowerCase())) && // Name or Email match
            volunteer.pathwayInformation.some(
              (volunteerPathway) =>
                volunteerPathway.pathwayID === pathway.id &&
                (volunteerPathway.progress === "INPROGRESS" ||
                  volunteerPathway.progress === "COMPLETED")
            )
          );
        })
      : associatedVolunteers; // If no search query, show all volunteers

    setFilteredVolunteers(filtered);
  };

  //get associated trainings
  const fetchTrainings = async (associatedTrainings: string[]) => {
    try {
      const trainingPromises = associatedTrainings.map((trainingID) =>
        getTraining(trainingID)
      );
      const trainings = await Promise.all(trainingPromises);
      let associatedTrainingNames: { name: string; id: string }[] = [];
      trainings.forEach((training) =>
        associatedTrainingNames.push({ name: training.name, id: training.id })
      );
      setTrainingNames(associatedTrainingNames);
    } catch (error) {
      console.log("Failed to get pathways");
    }
  };

  //get pathways to display
  const displayedTrainings = showMore
    ? trainingNames
    : trainingNames.slice(0, 4);

  // Debounced search
  const updateQuery = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };

  const debouncedOnChange = debounce(updateQuery, 200);

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

  useEffect(() => {
    if (pathwayId !== undefined && !location.state?.pathwayID) {
      setLoading(true);
      getPathway(pathwayId)
        .then((pathwayData) => {
          setPathway(pathwayData);
          getVolunteers().then(async (volunteerData) => {
            setVolunteers(volunteerData);
            filterVolunteers(volunteerData);
          });
          fetchTrainings(pathwayData.trainingIDs);
        })
        .catch(() => {
          console.log("Failed to get training");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      if (location.state.pathwayID) {
        setPathway(location.state.pathwayID);
      }
      setLoading(false);
    }
  }, [pathwayId, location.state]);

  useEffect(() => {
    filterVolunteers(volunteers);
  }, [searchQuery]);

  const exportPathwayData = () => {
    // Reset the snackbar
    setOpenSelectSnackbar(false);

    // Check if any row is selected
    if (selectionModel.length === 0) {
      setOpenSelectSnackbar(true);
      return;
    }

    const header = columns.map((column) => column.headerName);
    const rowData = selectionModel.map((row) => {
      const pathway = pathwayRows.find((pathway) => pathway.id === row);
      if (pathway) {
        return [
          pathway.volunteerName,
          pathway.email,
          pathway.dateCompleted,
          pathway.timeCompleted,
          pathway.quizScore,
          pathway.passFailStatus,
          pathway.status,
        ];
      }
    });
    exportTableToCSV([header, ...rowData]);
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
              <h1 className={styles.nameHeading}>Pathway Details</h1>
              <div className={styles.profileIcon}>
                <ProfileIcon />
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : (
              <>
                <div className={styles.volunteerInfo}>
                  <div>
                    <h2 className={styles.text}>{pathway.name}</h2>
                  </div>
                  <br></br>
                  <div>
                    <b className={styles.text}>Included Trainings: </b>
                    <div className={styles.relatedTrainings}>
                      {displayedTrainings.map((training, idx) => (
                        <div
                          className={`${styles.marker} ${styles.pathwayMarker}`}
                          onClick={() => {
                            navigate(`/management/training/${training.id}`);
                          }}
                          key={idx}>
                          {training.name}
                        </div>
                      ))}

                      {trainingNames.length > 4 && (
                        <button
                          onClick={() => setShowMore(!showMore)}
                          className={styles.toggleButton}>
                          {showMore ? "SEE LESS" : "SEE MORE"}
                        </button>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <div>
                    <b className={styles.text}>Enrolled Volunteers: </b>
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

                  <Button
                    sx={{
                      ...whiteButtonOceanGreenBorder,
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      fontWeight: "bold",
                      width: "375px",
                    }}
                    onClick={exportPathwayData}>
                    Export
                  </Button>
                </div>

                <div className={styles.contentSection}>
                  <>
                    <div className={styles.innerGrid}>
                      <DataGrid
                        rows={pathwayRows}
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
                          navigate(`/management/volunteer/${row.id}`);
                        }}
                        selectionModel={selectionModel} // Controlled selection model
                        onSelectionModelChange={(newSelection) =>
                          setSelectionModel(newSelection)
                        }
                      />
                    </div>
                  </>
                </div>

                <div className={styles.buttonContainer}>
                  <Button
                    sx={{
                      ...whiteButtonGrayBorder,
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      width: "100px",
                    }}
                    onClick={() =>
                      navigate("/management", {
                        state: {
                          fromPage: "pathway",
                        },
                      })
                    }>
                    BACK
                  </Button>
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

export default AdminPathwayDetailsPage;

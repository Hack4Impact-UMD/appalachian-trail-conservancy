import { useEffect, useState } from "react";
import styles from "./AdminTrainingDetails.module.css";
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TrainingID } from "../../types/TrainingType.ts";
import {
  exportTableToCSV,
  getPathway,
  getTraining,
  getVolunteers,
} from "../../backend/FirestoreCalls.ts";
import { VolunteerID } from "../../types/UserType.ts";
import Loading from "../../components/LoadingScreen/Loading.tsx";

function AdminTrainingDetails() {
  const navigate = useNavigate();
  const trainingId = useParams().id;
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
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [openSelectSnackbar, setOpenSelectSnackbar] = useState<boolean>(false);
  const [showMore, setShowMore] = useState(false);
  const [pathwayNames, setPathwayNames] = useState<
    { name: string; id: string }[]
  >([]);
  const [volunteers, setVolunteers] = useState<VolunteerID[]>([]);
  const [training, setTraining] = useState<TrainingID>({
    name: "",
    id: "",
    shortBlurb: "",
    description: "",
    coverImage: "",
    resources: [],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    associatedPathways: [],
    status: "DRAFT",
  });

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
    { field: "timeCompleted", headerName: "TIME", width: 150 },
    { field: "quizScore", headerName: "SCORE", width: 150 },
    { field: "passFailStatus", headerName: "P/F", width: 100 },
    { field: "status", headerName: "STATUS", width: 130 },
  ];

  // map the filtered volunteers to rows for DataGrid
  const trainingRows = filteredVolunteers.flatMap((volunteer) => {
    return volunteer.trainingInformation
      .filter(
        (volunteerTraining) =>
          volunteerTraining.progress === "INPROGRESS" ||
          volunteerTraining.progress === "COMPLETED"
      )
      .filter(
        (volunteerTraining) => volunteerTraining.trainingID === training.id
      )
      .map((volunteerTraining) => {
        const passingScore = training.quiz.passingScore;
        const quizScore =
          volunteerTraining.quizScoreRecieved === undefined
            ? "N/A"
            : `${volunteerTraining.quizScoreRecieved} / ${training.quiz.numQuestions}`;
        const passFailStatus =
          volunteerTraining.quizScoreRecieved === undefined
            ? "N/A"
            : volunteerTraining.quizScoreRecieved >= passingScore
            ? "Passed"
            : "Failed";

        return {
          id: volunteer.id,
          volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
          email: volunteer.email, // Added email field
          dateCompleted: formatDate(volunteerTraining.dateCompleted),
          timeCompleted: formatTime(volunteerTraining.dateCompleted),
          quizScore: quizScore,
          passFailStatus: passFailStatus,
          status: volunteerTraining.progress,
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
            volunteer.trainingInformation.some(
              (volunteerTraining) =>
                volunteerTraining.trainingID === training.id &&
                (volunteerTraining.progress === "INPROGRESS" ||
                  volunteerTraining.progress === "COMPLETED")
            )
          );
        })
      : associatedVolunteers; // If no search query, show all volunteers

    setFilteredVolunteers(filtered);
  };

  //get associated pathways
  const fetchPathways = async (associatedPathways: string[]) => {
    try {
      const pathwayPromises = associatedPathways.map((pathwayID) =>
        getPathway(pathwayID)
      );
      const pathways = await Promise.all(pathwayPromises);
      let associatedPathwayNames: { name: string; id: string }[] = [];
      pathways.forEach((pathway) =>
        associatedPathwayNames.push({ name: pathway.name, id: pathway.id })
      );
      setPathwayNames(associatedPathwayNames);
    } catch (error) {
      console.log("Failed to get pathways");
    }
  };

  //get pathways to display
  const displayedPathways = showMore ? pathwayNames : pathwayNames.slice(0, 4);

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
    if (trainingId !== undefined && !location.state?.trainingID) {
      setLoading(true);
      getTraining(trainingId)
        .then((trainingData) => {
          setTraining(trainingData);
          getVolunteers().then(async (volunteerData) => {
            setVolunteers(volunteerData);
            filterVolunteers(volunteerData);
          });
          fetchPathways(trainingData.associatedPathways);
        })
        .catch(() => {
          console.log("Failed to get training");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      if (location.state.trainingID) {
        setTraining(location.state.trainingID);
      }
      setLoading(false);
    }
  }, [trainingId, location.state]);

  useEffect(() => {
    filterVolunteers(volunteers);
  }, [searchQuery]);

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
          training.volunteerName,
          training.email,
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
              <h1 className={styles.nameHeading}>Training Details</h1>
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
                    <h2 className={styles.text}>{training.name}</h2>
                  </div>
                  <br></br>
                  <div>
                    <b className={styles.text}>Part of Pathways: </b>
                    {displayedPathways.length === 0 ? (
                      <p>This training is not a part of any pathway.</p>
                    ) : (
                      <div className={styles.relatedPathways}>
                        {displayedPathways.map((pathway, idx) => (
                          <div
                            className={`${styles.marker} ${styles.pathwayMarker}`}
                            onClick={() => {
                              navigate(`/management/pathway/${pathway.id}`);
                            }}
                            key={idx}>
                            {pathway.name}
                          </div>
                        ))}

                        {pathwayNames.length > 4 && (
                          <button
                            onClick={() => setShowMore(!showMore)}
                            className={styles.toggleButton}>
                            {showMore ? "SEE LESS" : "SEE MORE"}
                          </button>
                        )}
                      </div>
                    )}
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
                    onClick={exportTrainingData}>
                    Export
                  </Button>
                </div>

                <div className={styles.contentSection}>
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
                          fromPage: "training",
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

export default AdminTrainingDetails;

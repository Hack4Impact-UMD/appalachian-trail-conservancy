import { useEffect, useState } from "react";
import styles from "./AdminTrainingDetails.module.css";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
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
    if (!isoDate) return "Not Available";
    const date = DateTime.fromISO(isoDate);
    return date.isValid
      ? date.toLocaleString(DateTime.DATE_SHORT)
      : "Not Available";
  };

  const formatTime = (isoDate: string) => {
    if (!isoDate) return "Not Available";
    const date = DateTime.fromISO(isoDate);
    return date.isValid
      ? date.toLocaleString(DateTime.TIME_SIMPLE)
      : "Not Available";
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
  const rows = filteredVolunteers.flatMap((volunteer) => {
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
        const quizScoreFormatted = `${volunteerTraining.quizScoreRecieved} / ${training.quiz.numQuestions}`;

        return {
          id: volunteer.id,
          volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
          email: volunteer.email, // Added email field
          dateCompleted: formatDate(volunteerTraining.dateCompleted),
          timeCompleted: formatTime(volunteerTraining.dateCompleted),
          quizScore: quizScoreFormatted || "Not Available",
          passFailStatus:
            volunteerTraining.quizScoreRecieved === undefined
              ? "N/A"
              : volunteerTraining.quizScoreRecieved >= passingScore
              ? "Passed"
              : "Failed",
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
              <ProfileIcon />
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
                    }}>
                    Export
                  </Button>
                </div>

                <div className={styles.contentSection}>
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
                          navigate(`/management/volunteer/${row.id}`);
                        }}
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
                    onClick={() => navigate("/management")}>
                    BACK
                  </Button>
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

export default AdminTrainingDetails;

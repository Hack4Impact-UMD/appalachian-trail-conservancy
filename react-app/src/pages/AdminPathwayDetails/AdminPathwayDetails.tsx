import { useEffect, useState } from "react";
import styles from "./AdminPathwayDetails.module.css";
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
import { PathwayID } from "../../types/PathwayType.ts";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getPathway,
  getTraining,
  getVolunteers,
} from "../../backend/FirestoreCalls.ts";
import {
  User,
  Volunteer,
  VolunteerID,
  VolunteerTraining,
} from "../../types/UserType.ts";

function AdminPathwayDetails() {
  const navigate = useNavigate();
  const pathwayId = useParams().id;
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    window.innerWidth >= 1200
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [trainingNames, setTrainingNames] = useState<
    { name: string; id: string }[]
  >([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  //   const [training, setTraining] = useState<TrainingID>({
  //     name: "",
  //     id: "",
  //     shortBlurb: "",
  //     description: "",
  //     coverImage: "",
  //     resources: [],
  //     quiz: {
  //       questions: [],
  //       numQuestions: 0,
  //       passingScore: 0,
  //     },
  //     associatedPathways: [],
  //     certificationImage: "",
  //     status: "DRAFT",
  //   });
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
    badgeImage: "",
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
    return volunteer.pathwayInformation
      .filter(
        (volunteerPathway) =>
          volunteerPathway.progress === "INPROGRESS" ||
          volunteerPathway.progress === "COMPLETED"
      )
      .filter((volunteerPathway) => volunteerPathway.pathwayID === pathway.id)
      .map((volunteerPathway) => {
        const passingScore = pathway.quiz.passingScore;
        const quizScoreFormatted = `${volunteerPathway.quizScoreRecieved} / ${pathway.quiz.numQuestions}`;

        return {
          id: `${volunteer.auth_id}-${pathway.id}`,
          volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
          email: volunteer.email, // Added email field
          dateCompleted: formatDate(volunteerPathway.dateCompleted),
          timeCompleted: formatTime(volunteerPathway.dateCompleted),
          quizScore: quizScoreFormatted || "Not Available",
          passFailStatus:
            volunteerPathway.quizScoreRecieved === undefined
              ? "N/A"
              : volunteerPathway.quizScoreRecieved >= passingScore
              ? "Passed"
              : "Failed",
          status: volunteerPathway.progress,
        };
      });
  });

  //search bar
  const filterVolunteers = (associatedVolunteers: Volunteer[]) => {
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
        open={open}
      >
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
        });
    } else {
      if (location.state.pathwayID) {
        setPathway(location.state.pathwayID);
      }
    }
  }, [pathwayId, location.state]);

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
        }}
      >
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
              <ProfileIcon />
            </div>

            <div className={styles.volunteerInfo}>
              <div>
                <h2 className={styles.text}>NAME: {pathway.name} </h2>
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
                      key={idx}
                    >
                      {training.name}
                    </div>
                  ))}

                  {trainingNames.length > 4 && (
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className={styles.toggleButton}
                    >
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
              >
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
                    onRowClick={(row) => {}}
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
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                BACK
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AdminPathwayDetails;

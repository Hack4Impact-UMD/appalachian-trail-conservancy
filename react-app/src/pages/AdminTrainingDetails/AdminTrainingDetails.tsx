import { useEffect, useState } from "react";
import styles from "./AdminTrainingDetails.module.css";
import {
  Button,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
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
import { useNavigate } from "react-router-dom";

function AdminTrainingDetails() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const pathways: { [key: string]: PathwayID } = {
    "pathway-101": {
      id: "pathway-101",
      name: "Pathway 1",
      shortBlurb: "",
      description: "",
      coverImage: "",
      trainingIDs: [],
      quiz: { questions: [], numQuestions: 0, passingScore: 0 },
      badgeImage: "",
      status: "PUBLISHED",
    },
    "pathway-102": {
      id: "pathway-102",
      name: "Pathway 2",
      shortBlurb: "",
      description: "",
      coverImage: "",
      trainingIDs: [],
      quiz: { questions: [], numQuestions: 0, passingScore: 0 },
      badgeImage: "",
      status: "PUBLISHED",
    },
    "pathway-103": {
      id: "pathway-103",
      name: "Pathway 3",
      shortBlurb: "",
      description: "",
      coverImage: "",
      trainingIDs: [],
      quiz: { questions: [], numQuestions: 0, passingScore: 0 },
      badgeImage: "",
      status: "PUBLISHED",
    },
    "pathway-104": {
      id: "pathway-104",
      name: "Pathway 4",
      shortBlurb: "",
      description: "",
      coverImage: "",
      trainingIDs: [],
      quiz: { questions: [], numQuestions: 0, passingScore: 0 },
      badgeImage: "",
      status: "PUBLISHED",
    },
    "pathway-105": {
      id: "pathway-105",
      name: "Pathway 5",
      shortBlurb: "",
      description: "",
      coverImage: "",
      trainingIDs: [],
      quiz: { questions: [], numQuestions: 0, passingScore: 0 },
      badgeImage: "",
      status: "PUBLISHED",
    },
    "pathway-106": {
      id: "pathway-106",
      name: "Pathway 6",
      shortBlurb: "",
      description: "",
      coverImage: "",
      trainingIDs: [],
      quiz: { questions: [], numQuestions: 0, passingScore: 0 },
      badgeImage: "",
      status: "PUBLISHED",
    },
  };

  // Dummy Training Data
  const trainingData = {
    id: "training-101",
    name: "Advanced Volunteer Leadership",
    shortBlurb: "Learn to become a leader in volunteer programs.",
    description:
      "This training program is designed to help volunteers take the next step in their leadership journey. It covers topics such as team management, conflict resolution, and program development.",
    coverImage: "https://example.com/training-cover.jpg",
    resources: [
      {
        type: "VIDEO",
        link: "https://example.com/leadership-video.mp4",
        title: "Leadership Skills Overview",
      },
      {
        type: "PDF",
        link: "https://example.com/leadership-guide.pdf",
        title: "Comprehensive Leadership Guide",
      },
    ],
    quiz: { passingScore: 3, numQuestions: 5 },
    associatedPathways: [
      "pathway-101",
      "pathway-102",
      "pathway-103",
      "pathway-104",
      "pathway-105",
      "pathway-106",
    ],
    certificationImage: "https://example.com/certification.jpg",
    status: "PUBLISHED",
  };

  // Dummy Volunteers Data
  const volunteers = [
    {
      auth_id: "v12345",
      firstName: "Blub",
      lastName: "Blub",
      email: "blub@example.com",
      trainingInformation: [
        {
          trainingID: "training-101",
          progress: "INPROGRESS",
          dateCompleted: "",
          numCompletedResources: 3,
          numTotalResources: 5,
          quizScoreRecieved: 2,
        },
        {
          trainingID: "training-102",
          progress: "COMPLETED",
          dateCompleted: "2024-01-15T10:30:00.000Z",
          numCompletedResources: 5,
          numTotalResources: 5,
          quizScoreRecieved: 2,
        },
      ],
    },
    {
      auth_id: "v67890",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      trainingInformation: [
        {
          trainingID: "training-101",
          progress: "COMPLETED",
          dateCompleted: "2024-02-15T10:30:00.000Z",
          numCompletedResources: 5,
          numTotalResources: 5,
          quizScoreRecieved: 5,
        },
        {
          trainingID: "training-103",
          progress: "INPROGRESS",
          dateCompleted: "",
          numCompletedResources: 2,
          numTotalResources: 5,
          quizScoreRecieved: 4,
        },
      ],
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    window.innerWidth >= 1200
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [filteredTrainings, setFilteredTrainings] = useState(volunteers);
  const [showMore, setShowMore] = useState(false);

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
  const rows = filteredTrainings.flatMap((volunteer) => {
    return volunteer.trainingInformation
      .filter(
        (training) =>
          training.progress === "INPROGRESS" ||
          training.progress === "COMPLETED"
      )
      .filter((training) => training.trainingID === trainingData.id)
      .map((training) => {
        const passingScore = trainingData.quiz.passingScore;
        const quizScoreFormatted = `${training.quizScoreRecieved} / ${trainingData.quiz.numQuestions}`;

        return {
          id: `${volunteer.auth_id}-${training.trainingID}`,
          volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
          email: volunteer.email, // Added email field
          dateCompleted: formatDate(training.dateCompleted),
          timeCompleted: formatTime(training.dateCompleted),
          quizScore: quizScoreFormatted || "Not Available",
          passFailStatus:
            training.quizScoreRecieved >= passingScore ? "Passed" : "Failed",
          status: training.progress,
        };
      });
  });

  //search bar
  const filterTrainings = () => {
    const filtered = searchQuery
      ? volunteers.filter((volunteer) => {
          const fullName =
            `${volunteer.firstName} ${volunteer.lastName}`.toLowerCase();
          const email = volunteer.email.toLowerCase();

          return (
            (fullName.includes(searchQuery.toLowerCase()) ||
              email.includes(searchQuery.toLowerCase())) && // Name or Email match
            volunteer.trainingInformation.some(
              (training) =>
                training.trainingID === trainingData.id &&
                (training.progress === "INPROGRESS" ||
                  training.progress === "COMPLETED")
            )
          );
        })
      : volunteers; // If no search query, show all volunteers

    setFilteredTrainings(filtered);
  };

  useEffect(() => {
    filterTrainings();
  }, [searchQuery]);

  //get associated pathways
  const pathwayNames = trainingData.associatedPathways.map(
    (pathwayId) => pathways[pathwayId]
  );

  //get pathways to display
  const displayedPathways = showMore ? pathwayNames : pathwayNames.slice(0, 4);

  // Debounced search
  const updateQuery = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };

  const debouncedOnChange = debounce(updateQuery, 200);

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
              <h1 className={styles.nameHeading}>Training Details</h1>
              <ProfileIcon />
            </div>

            <div className={styles.volunteerInfo}>
              <div>
                <h2 className={styles.text}>NAME: {trainingData.name} </h2>
              </div>
              <br></br>
              <div>
                <b className={styles.text}>Part of Pathways: </b>
                <div className={styles.relatedPathways}>
                  {displayedPathways.map((pathway, idx) => (
                    <div
                      className={`${styles.marker} ${styles.pathwayMarker}`}
                      onClick={() => {
                        navigate(`/pathways/${pathway.id}`);
                      }}
                      key={idx}
                    >
                      {pathway.name}
                    </div>
                  ))}

                  {pathwayNames.length > 4 && (
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

export default AdminTrainingDetails;

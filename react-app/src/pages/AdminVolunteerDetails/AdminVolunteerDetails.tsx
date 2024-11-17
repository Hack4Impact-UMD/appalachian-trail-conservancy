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
  CustomToggleButtonGroup,
  PurpleToggleButton,
  whiteButtonOceanGreenBorder,
  DataGridStyles,
  forestGreenButton,
  whiteButtonGrayBorder,
  forestGreenButtonPadding,
} from "../../muiTheme.ts";
import debounce from "lodash.debounce";
import hamburger from "../../assets/hamburger.svg";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar.tsx";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import { DateTime } from "luxon";

function AdminVolunteerDetails() {
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

  const volunteer = {
    auth_id: "v12345",
    email: "blub@example.com",
    firstName: "blub",
    lastName: "blub",
    type: "VOLUNTEER",
    trainingInformation: [
      {
        trainingID: "t001",
        progress: "INPROGRESS",
        dateCompleted: "",
        numCompletedResources: 3,
        numTotalResources: 5,
        quizScoreRecieved: 4,
      },
      {
        trainingID: "t002",
        progress: "COMPLETED",
        dateCompleted: "2024-01-15T10:30:00.000Z",
        numCompletedResources: 5,
        numTotalResources: 5,
        quizScoreRecieved: 5,
      },
    ],
    pathwayInformation: [
      {
        pathwayID: "p001",
        progress: "INPROGRESS",
        dateCompleted: "",
        trainingsCompleted: ["t001"],
        numTrainingsCompleted: 1,
        numTotalTrainings: 3,
        quizScoreRecieved: 1,
      },
    ],
  };

  // Dummy Training and Pathway Data
  const trainings = {
    t001: {
      name: "Training 1",
      shortBlurb: "Introduction to the basics.",
      description: "This training covers the basics of the volunteer program.",
      coverImage: "https://via.placeholder.com/150",
      resources: [
        {
          type: "VIDEO",
          link: "https://example.com/video1",
          title: "Intro Video",
        },
        { type: "PDF", link: "https://example.com/pdf1", title: "Intro PDF" },
      ],
      quiz: {
        questions: [
          {
            question: "What is your name?",
            choices: ["John", "Jane"],
            answer: "John",
          },
        ],
        numQuestions: 5,
        passingScore: 5,
      },
      associatedPathways: ["p001"],
      certificationImage: "https://via.placeholder.com/50",
      status: "PUBLISHED",
    },
    t002: {
      name: "Training 2",
      shortBlurb: "Advanced Topics.",
      description: "This training dives deeper into advanced topics.",
      coverImage: "https://via.placeholder.com/150",
      resources: [
        {
          type: "VIDEO",
          link: "https://example.com/video2",
          title: "Advanced Video",
        },
        {
          type: "PDF",
          link: "https://example.com/pdf2",
          title: "Advanced PDF",
        },
      ],
      quiz: {
        questions: [
          { question: "What is 2+2?", choices: ["3", "4"], answer: "4" },
        ],
        numQuestions: 5,
        passingScore: 3,
      },
      associatedPathways: ["p001"],
      certificationImage: "https://via.placeholder.com/50",
      status: "PUBLISHED",
    },
  };

  // Dummy Pathway Data
  const pathways = {
    p001: {
      name: "Volunteer Pathway 1",
      shortBlurb: "Pathway for beginners.",
      description:
        "This is a beginner pathway to help new volunteers get started.",
      coverImage: "https://via.placeholder.com/150",
      trainingIDs: ["t001", "t002"],
      quiz: {
        questions: [
          {
            question: "What is the first step?",
            choices: ["Step 1", "Step 2"],
            answer: "Step 1",
          },
        ],
        numQuestions: 1,
        passingScore: 50,
      },
      badgeImage: "https://via.placeholder.com/50",
      status: "PUBLISHED",
    },
  };

  const formatDate = (isoDate: string) => {
    if (!isoDate) {
      return "Not Available";
    }
    const date = DateTime.fromISO(isoDate);
    return date.isValid
      ? date.toLocaleString(DateTime.DATE_SHORT)
      : "Not Available";
  };

  const formatTime = (isoDate: string) => {
    if (!isoDate) {
      return "Not Available";
    }
    const date = DateTime.fromISO(isoDate);
    return date.isValid
      ? date.toLocaleString(DateTime.TIME_SIMPLE)
      : "Not Available";
  };

  const countTrainingsCompleted = (trainingInformation: any[]) => {
    let totalTrainings = 0;

    trainingInformation.forEach((training) => {
      if (
        training.progress === "INPROGRESS" ||
        training.progress === "COMPLETED"
      ) {
        totalTrainings++;
      }
    });

    return totalTrainings;
  };

  const countPathwaysCompleted = (pathwayInformation: any[]) => {
    let totalPathways = 0;

    pathwayInformation.forEach((pathway) => {
      if (
        pathway.progress === "INPROGRESS" ||
        pathway.progress === "COMPLETED"
      ) {
        totalPathways++;
      }
    });

    return totalPathways;
  };

  const formatTrainingsCompleted = (numCompleted: number, numTotal: number) => {
    return `${numCompleted}/${numTotal}`;
  };

  const [alignment, setAlignment] = useState<string | null>("trainings");
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const trainingsCompleted = countTrainingsCompleted(
    volunteer.trainingInformation
  );
  const pathwaysCompleted = countPathwaysCompleted(
    volunteer.pathwayInformation
  );
  const [filteredTrainings, setFilteredTrainings] = useState(
    volunteer.trainingInformation
  );
  const [filteredPathways, setFilteredPathways] = useState(
    volunteer.pathwayInformation
  );

  // DataGrid data
  const columns = [
    { field: "trainingName", headerName: "TRAINING", width: 250 },
    { field: "dateCompleted", headerName: "DATE", width: 180 },
    { field: "timeCompleted", headerName: "TIME", width: 180 },
    { field: "quizScore", headerName: "SCORE", width: 150 },
    { field: "passFailStatus", headerName: "P/F", width: 120 },
    { field: "status", headerName: "STATUS", width: 130 },
  ];

  const filterTrainings = () => {
    const filtered = searchQuery
      ? volunteer.trainingInformation.filter((training) =>
          trainings[training.trainingID as keyof typeof trainings].name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : volunteer.trainingInformation;

    setFilteredTrainings(filtered);
  };

  useEffect(() => {
    filterTrainings();
  }, [searchQuery]);

  const rows = filteredTrainings.map(
    (training: {
      trainingID: string;
      quizScoreRecieved: any;
      dateCompleted: any;
      progress: any;
    }) => {
      const trainingDetails =
        trainings[training.trainingID as keyof typeof trainings];

      const passingScore = trainingDetails.quiz.passingScore;
        const quizScoreFormatted = `${training.quizScoreRecieved} / ${trainingDetails.quiz.numQuestions}`;

      return {
        id: training.trainingID,
        trainingName: trainingDetails.name,
        dateCompleted: formatDate(training.dateCompleted),
        timeCompleted: formatTime(training.dateCompleted),
        quizScore: quizScoreFormatted || "Not Available",
        passFailStatus: training.quizScoreRecieved >= passingScore ? "Passed" : "Failed",
        status: training.progress,
      };
    }
  );

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

  const pathwayRows = filteredPathways.map((pathway) => {
    const pathwayDetails = pathways[pathway.pathwayID as keyof typeof pathways];

    return {
      id: pathway.pathwayID,
      pathwayName: pathwayDetails.name,
      progress: pathway.progress,
      dateCompleted: formatDate(pathway.dateCompleted), // Format the date using Luxon
      trainingsCompleted: formatTrainingsCompleted(
        pathway.numTrainingsCompleted,
        pathway.numTotalTrainings
      ),
      score:
        pathway.quizScoreRecieved !== undefined
          ? pathway.quizScoreRecieved
          : "Not Available", // Handle score
    };
  });

  useEffect(() => {
    const filtered = searchQuery
      ? volunteer.pathwayInformation.filter((pathway) =>
          pathways[pathway.pathwayID as keyof typeof pathways].name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : volunteer.pathwayInformation;

    setFilteredPathways(filtered);
  }, [searchQuery]);

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

  const debouncedOnChange = debounce(updateQuery, 200);

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
              <h1 className={styles.nameHeading}>Volunteer Details</h1>
              <ProfileIcon />
            </div>

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
                {trainingsCompleted}
              </div>
              <div className={styles.text}>
                <b>Pathways(s) Completed: </b>
                {pathwaysCompleted}
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
                      onRowClick={(row) => {}}
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
                      onRowClick={(row) => {}}
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
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                BACK
              </Button>
              <Button
                sx={{
                  ...whiteButtonOceanGreenBorder,
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  fontWeight: "bold",
                  width: "100px",
                }}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AdminVolunteerDetails;

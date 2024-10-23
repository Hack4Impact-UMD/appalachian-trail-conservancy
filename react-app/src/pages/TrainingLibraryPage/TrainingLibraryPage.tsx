import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import {
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import {
  forestGreenButtonPadding,
  whiteButtonGrayBorder,
  grayBorderSearchBar,
  whiteSelectGrayBorder,
} from "../../muiTheme";
import { getAllTrainings, getVolunteer } from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { VolunteerTraining } from "../../types/UserType";
import { useAuth } from "../../auth/AuthProvider.tsx";
import styles from "./TrainingLibraryPage.module.css";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import debounce from "lodash.debounce";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

function TrainingLibrary() {
  const auth = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [correlatedTrainings, setCorrelatedTrainings] = useState<
    { genericTraining: TrainingID; volunteerTraining?: VolunteerTraining }[]
  >([]);
  const [filteredTrainings, setFilteredTrainings] = useState<
    { genericTraining: TrainingID; volunteerTraining?: VolunteerTraining }[]
  >([]);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);

  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    // get all trainings from firebase
    getAllTrainings()
      .then((genericTrainings) => {
        // only use auth if it is finished loading
        if (!auth.loading && auth.id) {
          // get volunteer info from firebase. will contain volunteer progress on trainings
          getVolunteer(auth.id.toString())
            .then((volunteer) => {
              const volunteerTrainings = volunteer.trainingInformation;
              // match up the allGenericTrainings and volunteerTrainings, use setCorrelatedTrainings to set
              let allCorrelatedTrainings: {
                genericTraining: TrainingID;
                volunteerTraining?: VolunteerTraining;
              }[] = [];
              for (const genericTraining of genericTrainings) {
                // if genericTraining in volunteer.trainingInformation (has been started by volunteer), then we include that.
                // otherwise, it's undefined
                let startedByVolunteer = false;
                for (const volunteerTraining of volunteerTrainings) {
                  if (genericTraining.id == volunteerTraining.trainingID) {
                    startedByVolunteer = true;
                    allCorrelatedTrainings.push({
                      genericTraining: genericTraining,
                      volunteerTraining: volunteerTraining,
                    });
                  }
                }
                if (!startedByVolunteer) {
                  allCorrelatedTrainings.push({
                    genericTraining: genericTraining,
                    volunteerTraining: undefined,
                  });
                }
              }
              setCorrelatedTrainings(allCorrelatedTrainings);
              // also pass allCorrelatedTrainings into filterTrainings, in case it hasn't been set yet
              filterTrainings(allCorrelatedTrainings);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching volunteer:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching trainings:", error);
      });
  }, [auth.loading, auth.id]);

  useEffect(() => {
    filterTrainings(correlatedTrainings);
  }, [searchQuery, filterType]);

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

  const filterTrainings = (
    trainings?: {
      genericTraining: TrainingID;
      volunteerTraining?: VolunteerTraining;
    }[]
  ) => {
    // if correlatedTrainings hasn't been set yet, use what's passed in, which is correlatedTrainings
    let filtered = correlatedTrainings;
    if (correlatedTrainings.length === 0 && trainings) {
      filtered = trainings;
    }

    // search bar filter
    if (searchQuery) {
      filtered = filtered.filter((corrTraining) =>
        corrTraining.genericTraining.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // in progress / completed filters
    if (filterType === "inProgress") {
      filtered = filtered.filter(
        (corrTraining) =>
          corrTraining.volunteerTraining &&
          corrTraining.volunteerTraining.progress == "INPROGRESS"
      );
    } else if (filterType === "completed") {
      filtered = filtered.filter(
        (corrTraining) =>
          corrTraining.volunteerTraining &&
          corrTraining.volunteerTraining.progress == "COMPLETED"
      );
    }

    setFilteredTrainings(filtered);
  };

  const updateQuery = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setSearchQuery(e.target.value);

  const debouncedOnChange = debounce(updateQuery, 200);

  const renderEmptyMessage = () => {
    if (searchQuery != "") {
      return (
        <div className={styles.emptySearchMessage}>
          No Trainings Matching “{searchQuery}”
        </div>
      );
    } else {
      if (filterType == "all") {
        return <div className={styles.emptySearchMessage}>No Trainings</div>;
      } else if (filterType == "inProgress") {
        return (
          <div className={styles.emptySearchMessage}>
            No Trainings In Progress
          </div>
        );
      } else if (filterType == "completed") {
        return (
          <div className={styles.emptySearchMessage}>
            No Trainings Completed
          </div>
        );
      }
    }
  };

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{
          // Only apply left shift when screen width is greater than 1200px
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}
      >
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}> Trainings </h1>
              <ProfileIcon />
            </div>

            <div className={styles.searchBarContainer}>
              <OutlinedInput
                className={styles.searchBar}
                sx={grayBorderSearchBar}
                placeholder="Search..."
                onChange={debouncedOnChange}
                startAdornment={
                  <InputAdornment position="start">
                    <IoIosSearch />
                  </InputAdornment>
                }
              />

              {/* dropdown container */}
              <div className={styles.dropdownContainer}>
                <FormControl sx={{ width: 300 }}>
                  <Select
                    className={styles.dropdownMenu}
                    sx={whiteSelectGrayBorder}
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="Filter"
                  >
                    <MenuItem value="all">ALL</MenuItem>
                    <MenuItem value="inProgress">IN PROGRESS</MenuItem>
                    <MenuItem value="completed">COMPLETED</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* button container */}
              <div className={styles.buttonContainer}>
                <Button
                  sx={
                    filterType === "all"
                      ? forestGreenButtonPadding
                      : whiteButtonGrayBorder
                  }
                  variant="contained"
                  onClick={() => setFilterType("all")}
                >
                  All
                </Button>
                <Button
                  sx={
                    filterType === "inProgress"
                      ? forestGreenButtonPadding
                      : whiteButtonGrayBorder
                  }
                  variant="contained"
                  onClick={() => setFilterType("inProgress")}
                >
                  In Progress
                </Button>
                <Button
                  sx={
                    filterType === "completed"
                      ? forestGreenButtonPadding
                      : whiteButtonGrayBorder
                  }
                  variant="contained"
                  onClick={() => setFilterType("completed")}
                >
                  Completed
                </Button>
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : (
              <>
                {filteredTrainings.length === 0 ? (
                  renderEmptyMessage()
                ) : (
                  <div className={styles.cardsContainer}>
                    {filteredTrainings.map((training, index) => (
                      <div className={styles.card} key={index}>
                        <TrainingCard
                          training={training.genericTraining}
                          volunteerTraining={training.volunteerTraining}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default TrainingLibrary;

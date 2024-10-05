import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
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
import { getAllPathways, getVolunteer } from "../../backend/FirestoreCalls";
import { PathwayID } from "../../types/PathwayType";
import { VolunteerPathway } from "../../types/UserType";
import { useAuth } from "../../auth/AuthProvider.tsx";
import styles from "./PathwayLibraryPage.module.css";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import debounce from "lodash.debounce";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import PathwayCard from "../../components/PathwayCard/PathwayCard";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

function PathwayLibrary() {
  const auth = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [correlatedPathways, setCorrelatedPathways] = useState<
    { genericPathway: PathwayID; volunteerPathway?: VolunteerPathway }[]
  >([]);
  const [filteredPathways, setFilteredPathways] = useState<
    { genericPathway: PathwayID; volunteerPathway?: VolunteerPathway }[]
  >([]);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);

  const filterPathways = (
    pathways?: {
      genericPathway: PathwayID;
      volunteerPathway?: VolunteerPathway;
    }[]
  ) => {
    let filtered = correlatedPathways;
    if (correlatedPathways.length === 0 && pathways) {
      filtered = pathways;
    }

    if (searchQuery) {
      filtered = filtered.filter((pathway) =>
        pathway.genericPathway.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    if (filterType === "inProgress") {
      filtered = filtered.filter(
        (pathway) =>
          pathway.volunteerPathway &&
          pathway.volunteerPathway.progress == "INPROGRESS"
      );
    } else if (filterType === "completed") {
      filtered = filtered.filter(
        (pathway) =>
          pathway.volunteerPathway &&
          pathway.volunteerPathway.progress == "COMPLETED"
      );
    }

    setFilteredPathways(filtered);
  };

  useEffect(() => {
    // get all pathways from firebase
    getAllPathways()
      .then((genericPathways) => {
        // only use auth if it is finished loading
        if (!auth.loading && auth.id) {
          // get volunteer info from firebase. will contain volunteer progress on pathways
          getVolunteer(auth.id.toString())
            .then((volunteer) => {
              const volunteerPathways = volunteer.pathwayInformation;

              // match up the genericPathways and volunteerPathways
              const allCorrelatedPathways: {
                genericPathway: PathwayID;
                volunteerPathway?: VolunteerPathway;
              }[] = [];

              for (const genericPathway of genericPathways) {
                let startedByVolunteer = false;
                for (const volunteerPathway of volunteerPathways) {
                  if (genericPathway.id == volunteerPathway.pathwayID) {
                    startedByVolunteer = true;
                    allCorrelatedPathways.push({
                      genericPathway: genericPathway,
                      volunteerPathway: volunteerPathway,
                    });
                  }
                }
                if (!startedByVolunteer) {
                  allCorrelatedPathways.push({
                    genericPathway: genericPathway,
                    volunteerPathway: undefined,
                  });
                }
              }
              setCorrelatedPathways(allCorrelatedPathways);
              filterPathways(allCorrelatedPathways);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching volunteer:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching pathways:", error);
      });
  }, [searchQuery, filterType, auth.loading, auth.id]);

  const updateQuery = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setSearchQuery(e.target.value);

  const debouncedOnChange = debounce(updateQuery, 500);

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Pathways</h1>
              <ProfileIcon />
            </div>

            <div className={styles.searchBarContainer}>
              <OutlinedInput
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
                <FormControl>
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
                {filteredPathways.length === 0 ? (
                  <div className={styles.emptySearchMessage}>
                    No Trainings Matching “{searchQuery}”
                  </div>
                ) : (
                  <div className={styles.cardsContainer}>
                    {filteredPathways.map((pathway, index) => (
                      <div className={styles.card} key={index}>
                        <PathwayCard
                          pathway={pathway.genericPathway}
                          volunteerPathway={pathway.volunteerPathway}
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

export default PathwayLibrary;

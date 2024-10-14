import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
import {
  forestGreenButtonPadding,
  forestGreenButton,
  whiteButtonGrayBorder,
  grayBorderSearchBar,
} from "../../muiTheme";
import { getAllTrainings, getVolunteer } from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { VolunteerTraining } from "../../types/UserType";
import { useAuth } from "../../auth/AuthProvider.tsx";
import styles from "./AdminTrainingLibraryPage.module.css";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import debounce from "lodash.debounce";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

function AdminTrainingLibrary() {
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
  }, [searchQuery, filterType, auth.loading, auth.id]);

  const updateQuery = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setSearchQuery(e.target.value);

  const debouncedOnChange = debounce(updateQuery, 200);

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
              <h1 className={styles.nameHeading}> Trainings </h1>
              <div className={styles.adminIcon}>
                <h6> ADMIN </h6>
                <div className={styles.profileIcon}>
                  <ProfileIcon />
                </div>
              </div>
            </div>
            <div>
              <Button
                sx={forestGreenButton}
                variant="contained"
                onClick={() => setFilterType("published")}
              >
                {" "}
                {/* Silly placeholder function*/}
                CREATE NEW TRAINING
              </Button>
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
            </div>
            <div className={styles.buttonContainer}>
              <Button
                sx={
                  filterType === "published"
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained"
                onClick={() => setFilterType("published")}
              >
                PUBLISHED
              </Button>
              <Button
                sx={
                  filterType === "drafts"
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained"
                onClick={() => setFilterType("drafts")}
              >
                DRAFTS
              </Button>
              <Button
                sx={
                  filterType === "archives"
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained"
                onClick={() => setFilterType("archives")}
              >
                ARCHIVES
              </Button>
            </div>

            {loading ? (
              <Loading />
            ) : (
              <>
                {filteredTrainings.length === 0 ? (
                  <div className={styles.emptySearchMessage}>
                    No Trainings Matching “{searchQuery}”
                  </div>
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

export default AdminTrainingLibrary;

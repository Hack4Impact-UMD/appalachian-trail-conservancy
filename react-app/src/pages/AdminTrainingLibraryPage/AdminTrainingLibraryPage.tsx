import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
import {
  forestGreenButtonPadding,
  forestGreenButtonLarge,
  whiteButtonGrayBorder,
  grayBorderSearchBar,
} from "../../muiTheme";
import { getAllTrainings, getVolunteer } from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { useAuth } from "../../auth/AuthProvider.tsx";
import styles from "./AdminTrainingLibraryPage.module.css";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import debounce from "lodash.debounce";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import AdminTrainingCard from "../../components/AdminTrainingCard/AdminTrainingCard.tsx";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

function AdminTrainingLibrary() {
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState("drafts");
  const [searchQuery, setSearchQuery] = useState("");
  const [correlatedTrainings, setCorrelatedTrainings] = useState<TrainingID[]>(
    []
  );
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingID[]>([]);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);

  const filterTrainings = (genericTrainings?: TrainingID[]) => {
    let filtered = correlatedTrainings;
    if (correlatedTrainings.length === 0 && genericTrainings) {
      filtered = genericTrainings;
    }

    // search bar filter
    if (searchQuery) {
      filtered = filtered.filter((corrTraining) =>
        corrTraining.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // in progress / completed filters
    if (filterType === "all") {
      filtered = filtered;
    } else if (filterType === "published") {
      filtered = filtered.filter(
        (corrTraining) => corrTraining.status == "PUBLISHED"
      );
    } else if (filterType === "drafts") {
      filtered = filtered.filter(
        (corrTraining) => corrTraining.status == "DRAFT"
      );
    } else if (filterType === "archives") {
      filtered = filtered.filter(
        (corrTraining) => corrTraining.status == "ARCHIVED"
      );
    }

    setFilteredTrainings(filtered);
  };

  useEffect(() => {
    if (!auth.loading && auth.id) {
      getAllTrainings()
        .then((genericTrainings) => {
          setCorrelatedTrainings(genericTrainings);
          filterTrainings(genericTrainings);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching trainings:", error);
        });
    }
  }, [auth.loading, auth.id]);

  useEffect(() => {
    filterTrainings(correlatedTrainings);
  }, [searchQuery, filterType]);

  const updateQuery = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setSearchQuery(e.target.value);

  const debouncedOnChange = debounce(updateQuery, 200);

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}>
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}> Trainings Library </h1>
              <ProfileIcon />
            </div>
            <div>
              <Button sx={forestGreenButtonLarge} variant="contained">
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
                  filterType === "drafts"
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained"
                onClick={() => setFilterType("drafts")}>
                DRAFTS
              </Button>

              <Button
                sx={
                  filterType === "published"
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained"
                onClick={() => setFilterType("published")}>
                PUBLISHED
              </Button>

              <Button
                sx={
                  filterType === "archives"
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained"
                onClick={() => setFilterType("archives")}>
                ARCHIVES
              </Button>
              <Button
                sx={
                  filterType === "all"
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained"
                onClick={() => setFilterType("all")}>
                ALL
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
                      <AdminTrainingCard training={training} key={index} />
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

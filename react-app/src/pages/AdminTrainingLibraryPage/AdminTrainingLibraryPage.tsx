import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import {
  Button,
  InputAdornment,
  OutlinedInput,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  forestGreenButtonPadding,
  forestGreenButtonLarge,
  whiteButtonGrayBorder,
  grayBorderSearchBar,
  whiteSelectGrayBorder,
  selectOptionStyle,
} from "../../muiTheme";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllTrainings } from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { useAuth } from "../../auth/AuthProvider.tsx";
import styles from "./AdminTrainingLibraryPage.module.css";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import debounce from "lodash.debounce";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar";
import Footer from "../../components/Footer/Footer";
import AdminTrainingCard from "../../components/AdminTrainingCard/AdminTrainingCard.tsx";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import hamburger from "../../assets/hamburger.svg";

function AdminTrainingLibrary() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filterType, setFilterType] = useState("drafts");
  const [searchQuery, setSearchQuery] = useState("");
  const [correlatedTrainings, setCorrelatedTrainings] = useState<TrainingID[]>(
    []
  );
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingID[]>([]);
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );

  // delete training snackbar
  useEffect(() => {
    if (location.state?.fromDelete && location.state?.showSnackbar) {
      setSnackbarMessage("Training successfully deleted.");
      setOpenSnackbar(true);
    }

    if (location.state?.fromUpdate && location.state?.showSnackbar) {
      setSnackbarMessage("Training successfully updated.");
      setOpenSnackbar(true);
    }
  }, [location.state]);

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

    // status filters
    if (filterType === "drafts") {
      filtered = filtered.filter(
        (corrTraining) => corrTraining.status == "DRAFT"
      );
    } else if (filterType === "published") {
      filtered = filtered.filter(
        (corrTraining) => corrTraining.status == "PUBLISHED"
      );
    } else if (filterType === "archives") {
      filtered = filtered.filter(
        (corrTraining) => corrTraining.status == "ARCHIVED"
      );
    }

    setFilteredTrainings(filtered);
  };
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

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

  const renderEmptyMessage = () => {
    if (searchQuery != "") {
      return `No Trainings Matching “${searchQuery}”`;
    } else {
      if (filterType == "all") {
        return "No Trainings";
      } else if (filterType == "drafts") {
        return "No Drafted Trainings";
      } else if (filterType == "published") {
        return "No Published Trainings";
      } else if (filterType == "archives") {
        return "No Archived Trainings";
      }
    }
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
              <h1 className={styles.nameHeading}>Trainings Library</h1>
              <ProfileIcon />
            </div>
            <div>
              <Button
                sx={forestGreenButtonLarge}
                variant="contained"
                onClick={() => navigate("/trainings/editor")}>
                CREATE NEW TRAINING
              </Button>
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
                    label="Filter">
                    <MenuItem value="drafts" sx={selectOptionStyle}>
                      DRAFTS
                    </MenuItem>
                    <MenuItem value="published" sx={selectOptionStyle}>
                      PUBLISHED
                    </MenuItem>
                    <MenuItem value="archives" sx={selectOptionStyle}>
                      ARCHIVES
                    </MenuItem>
                    <MenuItem value="all" sx={selectOptionStyle}>
                      ALL
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* button container */}
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
            </div>

            {loading ? (
              <div className={styles.centerTextLoading}>
                <Loading />
              </div>
            ) : (
              <>
                {filteredTrainings.length === 0 ? (
                  <div className={styles.centerTextLoading}>
                    {renderEmptyMessage()}
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
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position within the right section
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity="success">
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AdminTrainingLibrary;

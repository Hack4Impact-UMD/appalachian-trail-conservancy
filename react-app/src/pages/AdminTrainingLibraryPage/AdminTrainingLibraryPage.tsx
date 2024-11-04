import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import {
  Button,
  InputAdornment,
  OutlinedInput,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  forestGreenButtonPadding,
  forestGreenButtonLarge,
  whiteButtonGrayBorder,
  grayBorderSearchBar,
  whiteSelectGrayBorder,
  selectOptionStyle,
} from "../../muiTheme";
import { getAllTrainings, getVolunteer } from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import styles from "./AdminTrainingLibraryPage.module.css";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import debounce from "lodash.debounce";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import AdminTrainingCard from "../../components/AdminTrainingCard/AdminTrainingCard.tsx";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

function AdminTrainingLibrary() {
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState("drafts");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingID[]>([]);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [training1] = useState<TrainingID>({
    name: "Introduction to Cooperation",
    id: "123",
    shortBlurb: "",
    description: "",
    coverImage:
      "https://i0.wp.com/www.oxfordstudent.com/wp-content/uploads/2018/11/Spongebob-2.png?fit=770%2C433&ssl=1",
    resources: [],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    associatedPathways: [],
    certificationImage: "",
    status: "DRAFT",
  });
  const [training2] = useState<TrainingID>({
    name: "Training in the Mountains",
    id: "123",
    shortBlurb: "",
    description: "",
    coverImage:
      "https://i0.wp.com/www.oxfordstudent.com/wp-content/uploads/2018/11/Spongebob-2.png?fit=770%2C433&ssl=1",
    resources: [],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    associatedPathways: [],
    certificationImage: "",
    status: "PUBLISHED",
  });
  const [training3] = useState<TrainingID>({
    name: "How to be an Expert Hiker",
    id: "123",
    shortBlurb: "",
    description: "",
    coverImage:
      "https://i0.wp.com/www.oxfordstudent.com/wp-content/uploads/2018/11/Spongebob-2.png?fit=770%2C433&ssl=1",
    resources: [],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    associatedPathways: [],
    certificationImage: "",
    status: "ARCHIVED",
  });

  const trainings = [training1, training2, training3];

  const filterTrainings = () => {
    let filtered = trainings;

    // search bar filter
    if (searchQuery) {
      filtered = filtered.filter((training) =>
        training.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // status filters
    if (filterType === "drafts") {
      filtered = filtered.filter((training) => training.status == "DRAFT");
    } else if (filterType === "published") {
      filtered = filtered.filter((training) => training.status == "PUBLISHED");
    } else if (filterType === "archives") {
      filtered = filtered.filter((training) => training.status == "ARCHIVED");
    }

    setFilteredTrainings(filtered);
  };

  useEffect(() => {
    filterTrainings();
    setLoading(false);
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
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}>
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Trainings Library</h1>
              <ProfileIcon />
            </div>
            <div>
              <Button sx={forestGreenButtonLarge} variant="contained">
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
              <Loading />
            ) : (
              <>
                {filteredTrainings.length === 0 ? (
                  <div className={styles.emptySearchMessage}>
                    {renderEmptyMessage()}
                  </div>
                ) : (
                  <div className={styles.cardsContainer}>
                    {filteredTrainings.map((training, index) => (
                      <div className={styles.card} key={index}>
                        <AdminTrainingCard training={training} />
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

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
import { VolunteerTraining } from "../../types/UserType";
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
  const [filterType, setFilterType] = useState("all");
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
    name: "How to be a Diva",
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
  const [training3] = useState<TrainingID>({
    name: "How to be a Crackhead",
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

  const trainings = [training1, training2, training3];

  const filterTrainings = () => {
    let filtered = trainings;

    // search bar filter
    if (searchQuery) {
      filtered = filtered.filter((training) =>
        training.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // in progress / completed filters
    if (filterType === "all") {
      filtered = filtered;
    } else if (filterType === "published") {
      filtered = filtered.filter((training) => training.status == "PUBLISHED");
    } else if (filterType === "drafts") {
      filtered = filtered.filter((training) => training.status == "DRAFT");
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
              <h1 className={styles.nameHeading}> Trainings Library </h1>
              <div className={styles.adminIcon}>
                <h6> ADMIN </h6>
                <div className={styles.profileIcon}>
                  <ProfileIcon />
                </div>
              </div>
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
                  filterType === "all"
                    ? forestGreenButtonPadding
                    : whiteButtonGrayBorder
                }
                variant="contained"
                onClick={() => setFilterType("all")}
              >
                ALL
              </Button>
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

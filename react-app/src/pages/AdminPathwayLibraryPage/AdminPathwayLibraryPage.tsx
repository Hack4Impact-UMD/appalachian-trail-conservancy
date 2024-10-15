import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
import {
  forestGreenButtonPadding,
  forestGreenButton,
  whiteButtonGrayBorder,
  grayBorderSearchBar,
} from "../../muiTheme";
import { TrainingID } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType.ts";
import { useAuth } from "../../auth/AuthProvider.tsx";
import styles from "./AdminPathwayLibraryPage.module.css";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import debounce from "lodash.debounce";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import AdminPathwayCard from "../../components/AdminPathwayCard/AdminPathwayCard.tsx";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

function AdminPathwayLibrary() {
  const auth = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPathways, setFilteredPathways] = useState<PathwayID[]>([]);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);

  const [pathway1] = useState<PathwayID>({
    name: "Divalicious Pathway",
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

  const [pathway2] = useState<PathwayID>({
    name: "Pop Culture Whiz",
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
    status: "PUBLISHED",
  });

  const pathways = [pathway1, pathway2];

  const filterPathways = () => {
    let filtered = pathways;

    // search bar filter
    if (searchQuery) {
      filtered = filtered.filter((pathway) =>
        pathway.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // in progress / completed filters
    if (filterType === "published") {
      filtered = filtered.filter((pathway) => pathway.status == "PUBLISHED");
    } else if (filterType === "drafts") {
      filtered = filtered.filter((pathway) => pathway.status == "DRAFT");
    } else if (filterType === "archives") {
      filtered = filtered.filter((pathway) => pathway.status == "ARCHIVED");
    }

    setFilteredPathways(filtered);
  };

  useEffect(() => {
    filterPathways();
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
              <Button sx={forestGreenButton} variant="contained">
                CREATE NEW PATHWAY
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
                {filteredPathways.length === 0 ? (
                  <div className={styles.emptySearchMessage}>
                    No Trainings Matching “{searchQuery}”
                  </div>
                ) : (
                  <div className={styles.cardsContainer}>
                    {filteredPathways.map((pathway, index) => (
                      <div className={styles.card} key={index}>
                        <AdminPathwayCard pathway={pathway} />
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

export default AdminPathwayLibrary;

import styles from "./PathwayLibraryPage.module.css";
import { IoIosSearch } from "react-icons/io";
import { TextField, InputAdornment, Button } from "@mui/material";
import PathwayCard from "../../components/PathwayCard/PathwayCard";
import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { styledLibrarySearchBar } from "../../muiTheme";
import { darkGreenButton, whiteEmptyButton } from "../../muiTheme";

function PathwayLibrary() {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState<
    { title: string; subtitle: string; progress: number }[]
  >([]);

  const trainingCards = [
    { title: "Cat", subtitle: "Subtitle 1", progress: 23 },
    { title: "Catfish", subtitle: "Subtitle 2", progress: 100 },
    { title: "C", subtitle: "Subtitle 3", progress: 0 },
    { title: "Dog", subtitle: "Subtitle 4", progress: 10 },
    { title: "Cat", subtitle: "Subtitle 1", progress: 23 },
    { title: "Cat2", subtitle: "Subtitle 2", progress: 100 },
    { title: "C", subtitle: "Subtitle 3", progress: 76 },
    { title: "Dog", subtitle: "Subtitle 4", progress: 10 },
    { title: "NotInProgress", subtitle: "Subtitle 1", progress: 0 },
    { title: "Catfish", subtitle: "Subtitle 2", progress: 50 },
    { title: "C", subtitle: "Subtitle 3", progress: 76 },
    { title: "NotInProgress", subtitle: "Subtitle 4", progress: 0 },
    // Add more training card data as needed
  ];

  const filterTrainings = () => {
    let filtered = trainingCards;

    if (searchQuery) {
      filtered = filtered.filter((training) =>
        training.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType === "inProgress") {
      filtered = filtered.filter(
        (training) => training.progress > 0 && training.progress < 100
      );
    } else if (filterType === "completed") {
      filtered = filtered.filter((training) => training.progress === 100);
    }

    setFilteredTrainings(filtered);
  };

  useEffect(() => {
    filterTrainings();
  }, [searchQuery, filterType]);

  const updateQuery = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setSearchQuery(e.target.value);

  const debouncedOnChange = debounce(updateQuery, 500);

  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.header}>
          <h1 className={styles.nameHeading}>Pathways</h1>
          <div className={styles.imgContainer}>
            <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
          </div>
        </div>

        <div className={styles.searchBarContainer}>
          <TextField
            sx={styledLibrarySearchBar}
            variant="outlined"
            size="small"
            placeholder="Search..."
            onChange={debouncedOnChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoIosSearch />
                </InputAdornment>
              ),
            }}
          />
          <div className={styles.buttonContainer}>
            <Button
              sx={filterType === "all" ? darkGreenButton : whiteEmptyButton}
              onClick={() => setFilterType("all")}>
              All
            </Button>
            <Button
              sx={
                filterType === "inProgress" ? darkGreenButton : whiteEmptyButton
              }
              onClick={() => setFilterType("inProgress")}>
              In Progress
            </Button>
            <Button
              sx={
                filterType === "completed" ? darkGreenButton : whiteEmptyButton
              }
              onClick={() => setFilterType("completed")}>
              Completed
            </Button>
          </div>
        </div>

        <div className={styles.cardsContainer}>
          {filteredTrainings.map((training, index) => (
            <div className={styles.card} key={index}>
              <PathwayCard
                image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
                title={training.title}
                progress={training.progress}
              />
            </div>
          ))}
        </div>

        <div className={styles.subHeader}>
          <h2>Recommended</h2>
        </div>

        <div className={styles.recommendedContainer}>
          <div className={styles.card}>
            <PathwayCard
              image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
              title="Title"
            />
          </div>
          <div className={styles.card}>
            <PathwayCard
              image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
              title="Title"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PathwayLibrary;

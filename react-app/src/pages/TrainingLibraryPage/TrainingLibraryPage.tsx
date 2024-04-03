import styles from "./TrainingLibraryPage.module.css";
import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { Button, TextField, InputAdornment } from "@mui/material";
import {
  forestGreenButtonPadding,
  whiteButtonGrayBorder,
  styledLibrarySearchBar,
} from "../../muiTheme";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import debounce from "lodash.debounce";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import TrainingPopup from "../../components/TrainingPopup/TrainingPopup";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

function TrainingLibrary() {
  const [openTrainingPopup, setOpenTrainingPopup] = useState<boolean>(false);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState<
    { title: string; subtitle: string; progress: number }[]
  >([]);

  const trainingCards = [
    { title: "Cat", subtitle: "Subtitle 1", progress: 23 },
    { title: "NotInProgress", subtitle: "Subtitle 2", progress: 0 },
    { title: "Complete", subtitle: "Subtitle 3", progress: 100 },
    { title: "Dog", subtitle: "Subtitle 4", progress: 10 },
    { title: "NotInProgress2", subtitle: "Subtitle 1", progress: 0 },
    { title: "Catfish", subtitle: "Subtitle 2", progress: 50 },
    { title: "C", subtitle: "Subtitle 3", progress: 76 },
    { title: "Cat", subtitle: "Subtitle 4", progress: 100 },
    { title: "Cat", subtitle: "Subtitle 1", progress: 23 },
    { title: "Catfish", subtitle: "Subtitle 2", progress: 50 },
    { title: "C", subtitle: "Subtitle 3", progress: 76 },
    { title: "Dog", subtitle: "Subtitle 4", progress: 10 },
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

  const debouncedOnChange = debounce(updateQuery, 200);

  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.header}>
          <h1 className={styles.nameHeading}> Trainings </h1>
          <ProfileIcon />
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
              sx={
                filterType === "all"
                  ? forestGreenButtonPadding
                  : whiteButtonGrayBorder
              }
              variant="contained"
              onClick={() => setFilterType("all")}>
              All
            </Button>
            <Button
              sx={
                filterType === "inProgress"
                  ? forestGreenButtonPadding
                  : whiteButtonGrayBorder
              }
              variant="contained"
              onClick={() => setFilterType("inProgress")}>
              In Progress
            </Button>
            <Button
              sx={
                filterType === "completed"
                  ? forestGreenButtonPadding
                  : whiteButtonGrayBorder
              }
              variant="contained"
              onClick={() => setFilterType("completed")}>
              Completed
            </Button>
          </div>
        </div>

        <div className={styles.cardsContainer}>
          {filteredTrainings.map((training, index) => (
            <div className={styles.card} key={index}>
              <TrainingCard
                image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
                title={training.title}
                progress={training.progress}
                setOpenTrainingPopup={setOpenTrainingPopup}
              />
            </div>
          ))}
        </div>

        <div className={styles.subHeader}>
          <h2>Recommended</h2>
        </div>
        <div className={styles.cardsContainer}>
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            setOpenTrainingPopup={setOpenTrainingPopup}
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            setOpenTrainingPopup={setOpenTrainingPopup}
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            setOpenTrainingPopup={setOpenTrainingPopup}
          />
        </div>
      </div>
      <TrainingPopup
        open={openTrainingPopup}
        onClose={setOpenTrainingPopup}
        image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
      />
    </>
  );
}

export default TrainingLibrary;

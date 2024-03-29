import styles from "./TrainingLibrary.module.css";
import { IoIosSearch } from "react-icons/io";
import { TextField, InputAdornment } from "@mui/material";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import { useState, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import debounce from "lodash.debounce";

const styledSearchBar = {
  border: "2px solid var(--blue-gray)",
  borderRadius: "10px",
  width: "100%",
  height: 38,
  "& fieldset": { border: "none" },
};

function TrainingLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState<
    { title: string; subtitle: string; progress: number }[]
  >([]);

  const trainingCards = [
    { title: "Cat", subtitle: "Subtitle 1", progress: 23 },
    { title: "Catfish", subtitle: "Subtitle 2", progress: 50 },
    { title: "C", subtitle: "Subtitle 3", progress: 76 },
    { title: "Dog", subtitle: "Subtitle 4", progress: 10 },
    { title: "Cat", subtitle: "Subtitle 1", progress: 23 },
    { title: "Catfish", subtitle: "Subtitle 2", progress: 50 },
    { title: "C", subtitle: "Subtitle 3", progress: 76 },
    { title: "Dog", subtitle: "Subtitle 4", progress: 10 },
    { title: "Cat", subtitle: "Subtitle 1", progress: 23 },
    { title: "Catfish", subtitle: "Subtitle 2", progress: 50 },
    { title: "C", subtitle: "Subtitle 3", progress: 76 },
    { title: "Dog", subtitle: "Subtitle 4", progress: 10 },
    // Add more training card data as needed
  ];

  const filterTrainings = () => {
    const filtered = trainingCards.filter((training) =>
      training.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTrainings(filtered);
  };

  useEffect(() => {
    filterTrainings();
  }, [searchQuery]);

  const updateQuery = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setSearchQuery(e.target.value);

  const debouncedOnChange = debounce(updateQuery, 200);

  return (
    <>
      <NavigationBar />
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.header}>
          <h1 className={styles.nameHeading}>Training Library</h1>
          <div className={styles.imgContainer}>
            <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
          </div>
        </div>

        <div className={styles.searchBarContainer}>
          <TextField
            sx={styledSearchBar}
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
        </div>
        <div className={styles.cardsContainer}>
          {filteredTrainings.map((training, index) => (
            <div className={styles.card} key={index}>
              <TrainingCard
                image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
                title={training.title}
                progress={training.progress}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TrainingLibrary;

import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
import {
  forestGreenButtonPadding,
  whiteButtonGrayBorder,
  grayBorderSearchBar,
} from "../../muiTheme";
import styles from "./TrainingLibraryPage.module.css";
import debounce from "lodash.debounce";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import training1 from "../../assets/training1.jpg";
import training2 from "../../assets/training2.jpg";
import training3 from "../../assets/training3.png";
import training4 from "../../assets/training4.jpg";

function TrainingLibrary() {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState<
    { title: string; progress: number; image: string }[]
  >([]);

  const images = [training1, training2, training3, training4];

  const trainingCards = [
    {
      title: "Cat",
      progress: 23,
      image: images[Math.floor(Math.random() * images.length)],
    },
    {
      title: "NotInProgress",
      progress: 0,
      image: images[Math.floor(Math.random() * images.length)],
    },
    {
      title: "Complete",
      progress: 100,
      image: images[Math.floor(Math.random() * images.length)],
    },
    {
      title: "Dog",
      progress: 10,
      image: images[Math.floor(Math.random() * images.length)],
    },
    {
      title: "NotInProgress2",
      progress: 0,
      image: images[Math.floor(Math.random() * images.length)],
    },
    {
      title: "Catfish",
      progress: 50,
      image: images[Math.floor(Math.random() * images.length)],
    },
    {
      title: "C",
      progress: 76,
      image: images[Math.floor(Math.random() * images.length)],
    },
    {
      title: "Cat",
      progress: 100,
      image: images[Math.floor(Math.random() * images.length)],
    },
    {
      title: "Cat",
      progress: 23,
      image: images[Math.floor(Math.random() * images.length)],
    },
    {
      title: "Catfish",
      progress: 50,
      image: images[Math.floor(Math.random() * images.length)],
    },
    {
      title: "C",
      progress: 76,
      image: images[Math.floor(Math.random() * images.length)],
    },
    {
      title: "Dog",
      progress: 10,
      image: images[Math.floor(Math.random() * images.length)],
    },
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
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}> Trainings </h1>
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

            {filteredTrainings.length === 0 ? (
              <div className={styles.emptySearchMessage}>
                No Trainings Matching “{searchQuery}”
              </div>
            ) : (
              <div className={styles.cardsContainer}>
                {filteredTrainings.map((training, index) => (
                  <div className={styles.card} key={index}>
                    <TrainingCard
                      image={training.image}
                      title={training.title}
                      progress={training.progress}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default TrainingLibrary;

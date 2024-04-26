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
import { getAllTrainings, getVolunteer } from "../../backend/FirestoreCalls"
import { TrainingID } from "../../types/TrainingType";
import { getAll } from "firebase/remote-config";
import { VolunteerTraining } from "../../types/UserType";
import { useAuth } from "../../auth/AuthProvider.tsx";
 
function TrainingLibrary() {
  const auth = useAuth();

  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState<
    { training: TrainingID, volunteerTraining?: VolunteerTraining }[]>([]);
  const [allCorrelatedTrainings, setAllCorrelatedTrainings] = useState<
    { training: TrainingID, volunteerTraining?: VolunteerTraining } []>([]);

  
  // if (auth.loading) {
  //   return <></>;
  // }

  const images = [training1, training2, training3, training4];

  const filterTrainings = () => {
    let filtered = allCorrelatedTrainings;
    console.log('at filtering start', filtered);

    if (searchQuery) {
      filtered = filtered.filter((corrTraining) =>
        corrTraining.training.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType === "inProgress") {
      filtered = filtered.filter(
        (corrTraining) => corrTraining.volunteerTraining && corrTraining.volunteerTraining.progress == "INPROGRESS"
      );
    } else if (filterType === "completed") {
      filtered = filtered.filter((corrTraining) => corrTraining.volunteerTraining && corrTraining.volunteerTraining.progress == "COMPLETED");
    }

    setFilteredTrainings(filtered);
  };

  useEffect(() => {
    getAllTrainings()
      .then((genericTrainings) => {

        // console.log('allGenericTrainings', genericTrainings)
        
        getVolunteer(`${auth.id}`)
          .then((volunteer) => {
            const volunteerTrainings = volunteer.trainingInformation;

            // console.log('volunteer training info', volunteerTrainings)

            // match up the allGenericTrainings and volunteerTrainings, setAllTrainings to set
            let allCorrelatedTrainings: { training: TrainingID; volunteerTraining?: VolunteerTraining }[] = [];

            for (const genericTraining of genericTrainings){
              // if training in volunteer.trainingInformation, then we include that. otherwise, it's undefined
              let startedByVolunteer = false;
              for (const volunteerTraining of volunteerTrainings) {
                if (genericTraining.id == volunteerTraining.trainingID) {
                  startedByVolunteer = true;
                  allCorrelatedTrainings.push({training: genericTraining, volunteerTraining: volunteerTraining})
                }
              }
              if (!startedByVolunteer) {
                allCorrelatedTrainings.push({training: genericTraining, volunteerTraining: undefined})
              }
            }
            setAllCorrelatedTrainings(allCorrelatedTrainings)
            // console.log(allCorrelatedTrainings)

          })
          .catch((error) => {
            console.error('Error fetching volunteer:', error);
          })
        filterTrainings();
      })
      .catch((error) => {
        console.error('Error fetching trainings:', error);
      })
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
                {filteredTrainings.map((corrTraining, index) => (
                  <div className={styles.card} key={index}>
                    <TrainingCard
                      image={corrTraining.training.coverImage}
                      title={corrTraining.training.name}
                      // if there exists volunteer training, pass in the percentage completion. if doesn't exist, give 0
                      progress={
                        corrTraining.volunteerTraining?
                        (corrTraining.volunteerTraining.numCompletedResources / corrTraining.volunteerTraining.numTotalResources * 100)
                        : 0
                      }
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

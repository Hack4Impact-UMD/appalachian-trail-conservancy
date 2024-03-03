import styles from "./TrainingLibrary.module.css";
import { IoIosSearch } from "react-icons/io";
import { TextField, InputAdornment } from "@mui/material";
import TrainingCard from "../../components/TrainingCard/Training";

const styledSearchBar = {
  border: "2px solid var(--blue-gray)",
  borderRadius: "10px",
  width: "100%",
  height: 38,
  "& fieldset": { border: "none" },
};

function TrainingLibrary() {
  return (
    <>
      <div className={`${styles.split} ${styles.left}`}></div>
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.heading}>
          <h1>Training Library</h1>
          <div className={styles.imgContainer}>
            <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
          </div>
        </div>

        <div className={styles.searchBarContainer}>
          <TextField
            sx={styledSearchBar}
            variant="outlined"
            size="small"
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
          <div className={styles.individualCard}>
            <TrainingCard
              image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
              title="Title"
              subtitle="Subtitle"
              progress={23}
            />
          </div>
          <div className={styles.individualCard}>
            <TrainingCard
              image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
              title="Title"
              subtitle="Subtitle"
              progress={23}
            />
          </div>
          <div className={styles.individualCard}>
            <TrainingCard
              image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
              title="Title"
              subtitle="Subtitle"
              progress={23}
            />
          </div>
          <div className={styles.individualCard}>
            <TrainingCard
              image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
              title="Title"
              subtitle="Subtitle"
              progress={23}
            />
          </div>
          <div className={styles.individualCard}>
            <TrainingCard
              image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
              title="Title"
              subtitle="Subtitle"
              progress={23}
            />
          </div>
          <div className={styles.individualCard}>
            <TrainingCard
              image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
              title="Title"
              subtitle="Subtitle"
              progress={23}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default TrainingLibrary;

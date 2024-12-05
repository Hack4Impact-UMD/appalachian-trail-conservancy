import styles from "./BadgeCard.module.css";
import { DateTime } from "luxon";
import badgeFrame from "/src/assets/badgeFrame.svg";

interface BadgeProps {
  image: string;
  title: string;
  date: string; // YYYY-MM-DD
}

const Badge: React.FC<BadgeProps> = ({ image, title, date }) => {
  // Parse input date
  const parsedDate = DateTime.fromISO(date);
  const formattedDate = parsedDate.toFormat("MMMM dd, yyyy").toUpperCase();
  
  return (
    <div className={styles.badgeCard}>
      <div className={styles.badgeImageWrapper}>
        <img src={image} alt="Badge" className={styles.badgeImage} />
        <img src={badgeFrame} alt="Badge Frame" className={styles.badgeFrame} />
      </div>
      <div className={styles.badgeDetails}>
        <h2 className={styles.badgeTitle}>{title}</h2>
        <p className={styles.badgeDate}>{formattedDate}</p>
      </div>
    </div>
  );
};

export default Badge;

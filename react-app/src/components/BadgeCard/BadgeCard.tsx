import styles from "./BadgeCard.module.css";
import { DateTime } from "luxon";

interface BadgeProps {
  title: string;
  date: string; // YYYY-MM-DD
}

const Badge: React.FC<BadgeProps> = ({ title, date }) => {
  // Parse input date
  const parsedDate = DateTime.fromISO(date);

  // re-format
  const formattedDate = parsedDate.toFormat("MMMM dd, yyyy").toUpperCase();
  return (
    <div className={styles.badgeCard}>
      <div className={styles.badgeImage}>
        {/* Placeholder image would go here */}
      </div>
      <div className={styles.badgeDetails}>
        <h2 className={styles.badgeTitle}>{title}</h2>
        <p className={styles.badgeDate}>{formattedDate}</p>
      </div>
    </div>
  );
};

export default Badge;

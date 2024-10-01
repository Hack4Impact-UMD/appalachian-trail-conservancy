import styles from "./CertificateCard.module.css";
import { DateTime } from "luxon";
import certificateFrame from "/src/assets/certificateFrame.svg";

interface CertificateProps {
  image: string;
  title: string;
  date: string; // YYYY-MM-DD
}

const Certificate: React.FC<CertificateProps> = ({ image, title, date }) => {
  // Parse input date
  const parsedDate = DateTime.fromISO(date);
  const formattedDate = parsedDate.toFormat("MMMM dd, yyyy").toUpperCase();

  return (
    <div className={styles.certificateCard}>
      <div className={styles.certificateImageWrapper}>
        <img src={certificateFrame} alt="Certificate Frame" className={styles.certificateFrame} />
        <img src={image} alt="Certificate" className={styles.certificateImage} />
      </div>
      <div className={styles.certificateDetails}>
        <h2 className={styles.certificateTitle}>{title}</h2>
        <p className={styles.certificateDate}>{formattedDate}</p>
      </div>
    </div>
  );
};

export default Certificate;

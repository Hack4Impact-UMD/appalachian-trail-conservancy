import styles from "./CertificateCard.module.css";
import { DateTime } from "luxon";

interface CertificateProps {
  image: string;
  title: string;
  date: string; // YYYY-MM-DD
}

const Certificate: React.FC<CertificateProps> = ({ image, title, date }) => {
  // Parse input date
  const parsedDate = DateTime.fromISO(date);

  // re-format
  const formattedDate = parsedDate.toFormat("MMMM dd, yyyy");
  return (
    <div className={styles.certificateCard}>
      <div className={styles.certificateImage}>
        <img src={image} alt="Certificate" />
      </div>
      <div className={styles.certificateDetails}>
        <h2 className={styles.certificateTitle}>{title}</h2>
        <p className={styles.certificateDate}>{formattedDate}</p>
      </div>
    </div>
  );
};

export default Certificate;

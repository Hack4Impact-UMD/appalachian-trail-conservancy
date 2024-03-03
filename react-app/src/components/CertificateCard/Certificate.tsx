import React from 'react';
import styles from './Certificate.module.css';

interface CertificateProps {
  image: string;
  title: string;
  date: string;
}

const Certificate: React.FC<CertificateProps> = ({ image, title, date }) => {
  return (
    <div className={styles['certificateCard']}>
      <div className={styles['certificateImage']}>
        <img src={image} alt="Certificate" />
      </div>
      <div className={styles['certificateDetails']}>
        <h2 className={styles['certificateTitle']}>{title}</h2>
        <p className={styles['certificateDate']}>{date}</p>
      </div>
    </div>
  );
};

export default Certificate;
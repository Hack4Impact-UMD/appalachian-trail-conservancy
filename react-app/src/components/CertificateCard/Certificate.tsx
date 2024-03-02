import React from 'react';
import styles from './Certificate.module.css';

interface CertificateProps {
  image: string;
  title: string;
  date: string;
}

const Certificate: React.FC<CertificateProps> = ({ image, title, date }) => {
  return (
    <div className={styles['certificate-card']}>
      <div className={styles['certificate-image']}>
        <img src={image} alt="Certificate" />
      </div>
      <div className={styles['certificate-details']}>
        <h2 className={styles['certificate-title']}>{title}</h2>
        <p className={styles['certificate-date']}>{date}</p>
      </div>
    </div>
  );
};

export default Certificate;
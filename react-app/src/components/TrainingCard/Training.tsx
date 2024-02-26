import React from 'react';
import LinearProgressWithLabel from '@mui/material/LinearProgressWithLabel';

import styles from './Training.module.css';

interface TrainingCardProps {
  image: string;
  title: string;
  subtitle: string;
  progress?: number; // Optional progress value
}

const TrainingCard: React.FC<TrainingCardProps> = ({ image, title, subtitle, progress }) => {
  return (
    <div className={styles['training-card']}>
      <div className={styles['training-image']}>
        <img src={image} alt="Training Task" />
      </div>
      <div className={styles['training-content']}>
        <div className={styles['training-details']}>
          <h2 className={styles['training-title']}>{title}</h2>
          <p className={styles['training-subtitle']}>{subtitle}</p>
        </div>
        {progress !== undefined && (
          <div className={styles['progress-bar']}>
            <LinearProgressWithLabel value={progress} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingCard;
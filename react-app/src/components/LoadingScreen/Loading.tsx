import styles from './Loading.module.css';

const Loading = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.loading}></div>
    </div>
  );
};

export default Loading;

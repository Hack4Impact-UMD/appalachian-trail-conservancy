import styles from "./Loading.module.css";

const Loading = ({ color = "var(--blue-gray)" }): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.loading} style={{ borderTopColor: color }}></div>
    </div>
  );
};

export default Loading;

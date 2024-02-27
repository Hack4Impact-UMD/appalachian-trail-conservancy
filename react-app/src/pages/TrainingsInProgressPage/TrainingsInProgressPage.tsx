import styles from "./TrainingsInProgressPage.module.css";
import TrainingCard from "../../components/TrainingCard/Training.tsx";

function TrainingsInProgressPage() {
  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.split} ${styles.left}`}></div>
        <div className={`${styles.split} ${styles.right}`}>
          <div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <h1>Trainings in Progress</h1>
                  </td>
                  <td className={styles.alignRight}>
                    <img
                      src={
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_(Pygoscelis_antarctica)_04.jpg/1200px-South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_(Pygoscelis_antarctica)_04.jpg"
                      }
                      className={styles.profilePicture}
                    ></img>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.cardsContainer}>
            <div className={styles.flexItem}>
              <TrainingCard
                image="path_to_your_image.jpg"
                title="Training Task Title"
                subtitle="Training Task Subtitle"
                progress={50}
              />
            </div>
            <div className={styles.flexItem}>
              <TrainingCard
                image="path_to_your_image.jpg"
                title="Training Task Title"
                subtitle="Training Task Subtitle"
                progress={50}
              />
            </div>
            <div className={styles.flexItem}>
              <TrainingCard
                image="path_to_your_image.jpg"
                title="Training Task Title"
                subtitle="Training Task Subtitle"
                progress={50}
              />
            </div>
            <div className={styles.flexItem}>
              <TrainingCard
                image="path_to_your_image.jpg"
                title="Training Task Title"
                subtitle="Training Task Subtitle"
                progress={50}
              />
            </div>
            <div className={styles.flexItem}>
              <TrainingCard
                image="path_to_your_image.jpg"
                title="Training Task Title"
                subtitle="Training Task Subtitle"
                progress={50}
              />
            </div>
          </div>
          <h2>Recommended</h2>
          <div className={styles.cardsContainer}>
            <div className={styles.flexItem}>
              <TrainingCard
                image="path_to_your_image.jpg"
                title="Training Task Title"
                subtitle="Training Task Subtitle"
                progress={50}
              />
            </div>
            <div className={styles.flexItem}>
              <TrainingCard
                image="path_to_your_image.jpg"
                title="Training Task Title"
                subtitle="Training Task Subtitle"
                progress={50}
              />
            </div>
            <div className={styles.flexItem}>
              <TrainingCard
                image="path_to_your_image.jpg"
                title="Training Task Title"
                subtitle="Training Task Subtitle"
                progress={50}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrainingsInProgressPage;

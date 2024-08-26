import { TrainingResource } from "../../types/TrainingType";
import styles from "./ResourceComponent.module.css";

interface ResourceProps {
  resource: TrainingResource;
}

const ResourceComponent: React.FC<ResourceProps> = ({ resource }) => {
  return (
    <div className={styles.mainContainer}>
      {/* Video iframe */}
      <div className={styles.iframeContainer}>
        <iframe
          title="Video Player"
          src={resource.link}
          allowFullScreen></iframe>
      </div>

      <div className={styles.contentLabel}>
        {/* Video title */}
        <div className={styles.resourceTitle}>{resource.title}</div>
      </div>
    </div>
  );
};

export default ResourceComponent;

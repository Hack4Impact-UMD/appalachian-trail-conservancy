import { TrainingResource } from "../../types/TrainingType";
import styles from "./ResourceComponent.module.css";
import { useRef, useEffect, useState } from "react";

interface ResourceProps {
  resource: TrainingResource;
}

const ResourceComponent: React.FC<ResourceProps> = ({ resource }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [validLink, setValidLink] = useState(true);

  useEffect(() => {
    if (resource.link != iframeRef.current?.src) {
      setValidLink(false);
    }
  }, [iframeRef.current?.src]);

  return (
    <div className={styles.mainContainer}>
      {/* Video iframe */}
      {validLink ? (
        <div className={styles.iframeContainer}>
          <iframe
            title="Video Player"
            src={resource.link}
            ref={iframeRef}
            allowFullScreen></iframe>
        </div>
      ) : (
        <h2 className={styles.invalidLink}>
          Invalid resource. Please contact an ATC representative.
        </h2>
      )}

      <div className={styles.contentLabel}>
        {/* Video title */}
        <div className={styles.resourceTitle}>{resource.title}</div>
      </div>
    </div>
  );
};

export default ResourceComponent;

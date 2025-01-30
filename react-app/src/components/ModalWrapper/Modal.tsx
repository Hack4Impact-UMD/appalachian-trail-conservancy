import styles from "./Modal.module.css";

interface modalPropsType {
  open: boolean;
  onClose: any;
  children: React.ReactNode;
  height: number;
}

const Modal = ({
  open,
  onClose,
  children,
  height,
}: modalPropsType): React.ReactElement => {
  const heightString = height + "px";
  return (
    <div
      className={styles.modalContainer}
      onClick={(e) => {
        e.stopPropagation();
      }}>
      {open ? (
        <>
          <div className={styles.background} onClick={() => onClose()} />
          <div className={styles.centered}>
            <div className={styles.modal} style={{ height: heightString }}>
              {children}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

Modal.defaultProps = {
  width: 400,
};

export default Modal;

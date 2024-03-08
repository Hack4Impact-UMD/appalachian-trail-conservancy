import styles from './TrainingPopup.module.css';
import {Button} from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";


interface modalPropsType {
    open: boolean;
    onClose: any;
    children: React.ReactNode;
    height: number;
    width: number;
    image: string;
}

const TrainingPopup = ({
    open,
    onClose,
    children,
    height,
    width,
    image,
}: modalPropsType): React.ReactElement => {
    const heightString = height + 'px';
    const widthString = width + 'px';
    return (
        <div
            className={styles.modalContainer}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            {open ? (
                <>
                    <div className={styles.background} onClick={() => onClose()} />
                    <div className={styles.centered}>
                        <div
                            className={styles.modal}
                            style={{ height: heightString, width: widthString }}
                        >
                            <div className={styles.left}>
                                {children}
                                <Button variant="contained" href="#contained-buttons">
                                    Training
                                </Button>
                            </div>
                            <div className={styles.right}>
                                <div className={styles.closeButton}>
                                    <IoCloseOutline onClick={onClose}/>                              
                                </div>
                                <div className={styles.image}>
                                <img src={image} /> 
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

TrainingPopup.defaultProps = {
    width: 400,
};

export default TrainingPopup;

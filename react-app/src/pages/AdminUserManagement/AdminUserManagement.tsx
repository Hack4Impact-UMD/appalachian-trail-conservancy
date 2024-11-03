import { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import styles from "./AdminUserManagement.module.css";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";

function AdminUserManagement() {
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Data Management Portal</h1>
              <ProfileIcon />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminUserManagement;

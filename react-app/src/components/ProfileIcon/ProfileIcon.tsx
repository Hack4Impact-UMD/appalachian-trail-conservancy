import styles from "./ProfileIcon.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider.tsx";

const ProfileIcon = () => {
  // Subscribe to auth provider, pull first and last name
  const auth = useAuth();
  if (auth.loading) {
    return <></>;
  }
  const initials = `${auth.firstName.charAt(0)}${auth.lastName.charAt(0)}`;

  return (
    <div className={styles.profileContainer}>
      {auth.token?.claims?.role === "ADMIN" ? (
        <h5 className={styles.adminText}>ADMIN</h5>
      ) : (
        <></>
      )}
      <Link
        to="/profile"
        style={{
          textDecoration: "none !important", // Force override
          color: "inherit",
        }}
      >
        <div className={styles.profileIcon}>{initials}</div>
      </Link>
    </div>
  );
};

export default ProfileIcon;

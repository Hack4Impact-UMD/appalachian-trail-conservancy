import styles from "./SettingsProfileIcon.module.css";
import { useAuth } from "../../auth/AuthProvider";
const SettingsProfileIcon = () => {
  // Subscribe to auth provider, pull first and last name
  const auth = useAuth();
  if (auth.loading) {
    return <></>;
  }
  const initials = `${auth.firstName.charAt(0)}${auth.lastName.charAt(
    0
  )}`.toUpperCase();

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileIcon}>{initials}</div>
    </div>
  );
};

export default SettingsProfileIcon;

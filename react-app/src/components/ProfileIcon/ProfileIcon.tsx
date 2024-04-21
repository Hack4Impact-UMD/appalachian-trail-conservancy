import { Volunteer } from "../../types/UserType.ts";
import styles from "./ProfileIcon.module.css";
import { useAuth } from "../../auth/AuthProvider.tsx";

const ProfileIcon = () => {
  // Subscribe to auth provider, pull first and last name
  const auth = useAuth();
  if (auth.loading) {
    return <></>;
  }
  const initials = `${auth.firstName.charAt(0)}${auth.lastName.charAt(0)}`;

  return <div className={styles.profileIcon}>{initials}</div>;
};

export default ProfileIcon;

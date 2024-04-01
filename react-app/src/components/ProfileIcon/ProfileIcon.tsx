import React from "react";
import { Volunteer } from "../../types/UserType.ts";
import styles from "./ProfileIcon.module.css";

interface ProfileIconProps {
  user: Volunteer;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ user }) => {
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return <div className={styles.profileIcon}>{initials}</div>;
};

export default ProfileIcon;

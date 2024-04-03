import React from "react";
import { Volunteer } from "../../types/UserType.ts";
import styles from "./ProfileIcon.module.css";

const user: Volunteer = {
  auth_id: "example_auth_id",
  email: "example@example.com",
  type: "VOLUNTEER",
  firstName: "Rahul",
  lastName: "Anantuni",
  trainingInformation: [],
  pathwayInformation: [],
};

const ProfileIcon = () => {
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return <div className={styles.profileIcon}>{initials}</div>;
};

export default ProfileIcon;

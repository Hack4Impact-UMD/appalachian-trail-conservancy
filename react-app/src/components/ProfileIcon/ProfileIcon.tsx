import React from "react";
import { Volunteer } from "../../types/UserType.ts";

interface ProfileIconProps {
  user: Volunteer;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ user }) => {
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "forestgreen",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "18px",
      }}
    >
      {initials}
    </div>
  );
};

export default ProfileIcon;

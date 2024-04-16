import {
  getAuth,
  onIdTokenChanged,
  isSignInWithEmailLink,
  signInWithEmailLink,
  type User,
  type IdTokenResult,
} from "@firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import app from "../config/firebase";
import { getVolunteerWithAuth } from "../backend/FirestoreCalls";

interface Props {
  children: JSX.Element;
}

interface AuthContextType {
  user: User;
  token: IdTokenResult;
  firstName: String;
  lastName: String;
  id: String;
  loading: boolean;
}

// The AuthContext that other components may subscribe to.
const AuthContext = createContext<AuthContextType>(null!);

// Updates the AuthContext and re-renders children when the user changes.
// See onIdTokenChanged for what events trigger a change.
export const AuthProvider = ({ children }: Props): React.ReactElement => {
  const [user, setUser] = useState<User | any>(null!);
  const [token, setToken] = useState<IdTokenResult>(null!);
  const [firstName, setFirstName] = useState<String>("");
  const [lastName, setLastName] = useState<String>("");
  const [id, setID] = useState<String>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth(app);
    let email = window.localStorage.getItem("emailForSignIn");

    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email ?? "", window.location.href)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
        })
        .catch(() => {});
    }

    onIdTokenChanged(auth, (newUser) => {
      newUser?.getIdToken();
      setUser(newUser);
      if (newUser != null) {
        newUser
          .getIdTokenResult()
          .then((newToken) => {
            setToken(newToken);
            if (newToken.claims.role === "VOLUNTEER") {
              // Volunteer User
              getVolunteerWithAuth(newUser.uid)
                .then((volunteerData) => {
                  const { id, firstName, lastName } = volunteerData;
                  setID(id);
                  setFirstName(firstName);
                  setLastName(lastName);
                })
                .catch((error) => {
                  // Failed to get Volunteer information
                  console.log(error);
                });
            } else {
            }
          })
          .catch(() => {});
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, firstName, lastName, id, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

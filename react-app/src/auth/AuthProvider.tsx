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
import { getUserWithAuth } from "../backend/FirestoreCalls";

interface Props {
  children: JSX.Element;
}

interface AuthContextType {
  user: User;
  setUser: any;
  token: IdTokenResult;
  firstName: string;
  setFirstName: any;
  lastName: string;
  setLastName: any;
  id: string;
  loading: boolean;
}

// The AuthContext that other components may subscribe to.
const AuthContext = createContext<AuthContextType>(null!);

// Updates the AuthContext and re-renders children when the user changes.
// See onIdTokenChanged for what events trigger a change.
export const AuthProvider = ({ children }: Props): React.ReactElement => {
  const [user, setUser] = useState<User | any>(null!);
  const [token, setToken] = useState<IdTokenResult>(null!);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [id, setID] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const auth = getAuth(app);
    let email = window.localStorage.getItem("emailForSignIn");

    if (isSignInWithEmailLink(auth, window.location.href)) {
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      signInWithEmailLink(auth, email ?? "", window.location.href)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
          onIdTokenChanged(auth, (newUser) => {
            newUser?.getIdToken();
            setUser(newUser);
            setLoading(true);
            if (newUser != null) {
              newUser
                .getIdTokenResult()
                .then((newToken) => {
                  setToken(newToken);
                  getUserWithAuth(newUser.uid)
                    .then((userData) => {
                      const { id, firstName, lastName } = userData;
                      setID(id);
                      setFirstName(firstName);
                      setLastName(lastName);
                    })
                    .catch((error) => {
                      // Failed to get User information
                      console.log(error);
                    });
                })
                .catch(() => {});
            }
            setLoading(false);
          });
        })
        .catch(() => {});
    } else {
      onIdTokenChanged(auth, (newUser) => {
        newUser?.getIdToken();
        setUser(newUser);
        setLoading(true);
        if (newUser != null) {
          newUser
            .getIdTokenResult()
            .then((newToken) => {
              setToken(newToken);
              getUserWithAuth(newUser.uid)
                .then((userData) => {
                  const { id, firstName, lastName } = userData;
                  setID(id);
                  setFirstName(firstName);
                  setLastName(lastName);
                })
                .catch((error) => {
                  // Failed to get User information
                  console.log(error);
                });
            })
            .catch(() => {});
        }
        setLoading(false);
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        id,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

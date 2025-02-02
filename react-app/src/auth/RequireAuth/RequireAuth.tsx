import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../AuthProvider";
import styles from "./RequireAuth.module.css";
import Loading from "../../components/LoadingScreen/Loading";

interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const authContext = useAuth();
  if (authContext.loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />;
      </div>
    );
  } else if (!authContext.user) {
    return <Navigate to="/login" state={{ redir: window.location.pathname }} />;
  }

  return <>{children}</>;
};

export default RequireAuth;

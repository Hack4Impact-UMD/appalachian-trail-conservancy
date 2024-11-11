import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthProvider';
import styles from './RequireAdminAuth.module.css';
import Loading from '../../components/LoadingScreen/Loading';

interface Props {
  children: JSX.Element;
}

const RequireAdminAuth: React.FC<Props> = ({ children }) => {
  const authContext = useAuth();
  if (authContext.loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />;
      </div>
    );
  } else if (!authContext.user) {
    return <Navigate to="/login" state={{ redir: window.location.pathname }} />;
  } else if (authContext.token?.claims?.role != 'ADMIN') {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.errorMessage}>
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default RequireAdminAuth;

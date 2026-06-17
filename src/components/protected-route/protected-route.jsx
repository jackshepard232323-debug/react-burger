import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectIsAuthenticated } from '@services/auth/slice';

export const ProtectedRoute = ({ onlyUnauth = false, children }) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnauth && isAuthenticated) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnauth && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  onlyUnauth: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

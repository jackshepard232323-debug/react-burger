import { Navigate, useLocation, type Location } from 'react-router-dom';

import { useAppSelector } from '@/store/hooks';
import { selectIsAuthChecked, selectIsAuthenticated } from '@services/auth/slice';

import type { ReactNode } from 'react';

type TProtectedRouteProps = {
  onlyUnauth?: boolean;
  children: ReactNode;
};

export const ProtectedRoute = ({
  onlyUnauth = false,
  children,
}: TProtectedRouteProps): ReactNode => {
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnauth && isAuthenticated) {
    const from = (location.state as { from?: Location } | null)?.from ?? '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnauth && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

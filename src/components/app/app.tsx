import { useEffect, type ReactElement } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  type Location,
} from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { FeedPage } from '@pages/feed/feed';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password';
import { HomePage } from '@pages/home/home';
import { IngredientPage } from '@pages/ingredient/ingredient';
import { LoginPage } from '@pages/login/login';
import { NotFoundPage } from '@pages/not-found/not-found';
import { ProfilePage } from '@pages/profile/profile';
import { ProfileForm } from '@pages/profile/profile-form';
import { ProfileOrderPage } from '@pages/profile/profile-orders';
import { RegisterPage } from '@pages/register/register';
import { ResetPasswordPage } from '@pages/reset-password/reset-password';
import { checkAuth } from '@services/auth/actions';
import { setAuthChecked } from '@services/auth/slice';
import { fetchIngredients } from '@services/ingredients/actions';
import { clearOrder, selectOrderNumber } from '@services/order/slice';
import { getAccessToken } from '@utils/tokens';

import styles from './app.module.css';

export const App = (): ReactElement => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const orderNumber = useAppSelector(selectOrderNumber);

  const background = (location.state as { background?: Location } | null)?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    if (getAccessToken()) {
      dispatch(checkAuth());
    } else {
      dispatch(setAuthChecked(true));
    }
  }, [dispatch]);

  const closeIngredientModal = (): void => {
    navigate(-1);
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnauth>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnauth>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnauth>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnauth>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route path="/feed" element={<FeedPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileForm />} />
          <Route path="orders" element={<ProfileOrderPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={closeIngredientModal}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}

      {orderNumber !== null && (
        <Modal onClose={closeOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

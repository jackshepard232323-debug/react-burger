import { NavLink, Outlet } from 'react-router-dom';

import { useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@services/auth/actions';

import type { ReactElement } from 'react';

import styles from './profile.module.css';

export const ProfilePage = (): ReactElement => {
  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    `text text_type_main-medium ${styles.link} ${isActive ? '' : 'text_color_inactive'}`;
  const dispatch = useAppDispatch();

  const onLogout = (): void => {
    dispatch(logoutUser());
  };

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <NavLink to="/profile" end className={linkClass}>
          Профиль
        </NavLink>
        <NavLink to="/profile/orders" className={linkClass}>
          История заказов
        </NavLink>
        <button
          type="button"
          className={`text text_type_main-medium text_color_inactive ${styles.link}`}
          onClick={onLogout}
        >
          Выход
        </button>
        <p className="text text_type_main-default text_color_inactive mt-20">
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>

      <div className={styles.content}>
        <Outlet />
      </div>
    </main>
  );
};

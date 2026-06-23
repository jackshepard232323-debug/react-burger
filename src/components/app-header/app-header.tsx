import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';

import type { ReactElement } from 'react';

import styles from './app-header.module.css';

export const AppHeader = (): ReactElement => {
  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''} pt-4 pb-4 pl-5 pr-5`;

  const lastLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `${styles.navLink} ${styles.navLinkLast} ${isActive ? styles.navLinkActive : ''} pt-4 pb-4 pl-5 pr-5`;

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} pt-5 pb-5`}>
        <div className={styles.leftBlock}>
          <NavLink to="/" end className={linkClass}>
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Конструктор</p>
              </>
            )}
          </NavLink>
          <NavLink to="/feed" className={linkClass}>
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>

        <div className={styles.logoBlock}>
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <NavLink to="/profile" className={lastLinkClass}>
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">Личный кабинет</p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};

import { Link } from 'react-router-dom';

import styles from './not-found.module.css';

export const NotFoundPage = () => {
  return (
    <main className={styles.page}>
      <p className="text text_type_digits-large">404</p>
      <p className="text text_type_main-medium">Такой страницы не существует</p>
      <Link className={styles.link} to="/">
        Вернуться на главную
      </Link>
    </main>
  );
};

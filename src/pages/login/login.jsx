import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { loginUser } from '@services/auth/actions';

import styles from '../auth.module.css';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (evt) => {
    evt.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className="text text_type_main-medium">Вход</h1>
        <EmailInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
        />
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
        />
        <Button htmlType="submit" type="primary" size="medium">
          Войти
        </Button>
      </form>

      <div className={styles.hints}>
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?{' '}
          <Link className={styles.link} to="/register">
            Зарегистрироваться
          </Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link className={styles.link} to="/forgot-password">
            Восстановить пароль
          </Link>
        </p>
      </div>
    </main>
  );
};

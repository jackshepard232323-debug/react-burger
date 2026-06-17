import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { confirmPasswordReset } from '@utils/api';

import styles from '../auth.module.css';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (localStorage.getItem('resetPasswordAllowed') !== 'true') {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await confirmPasswordReset({ password, token: code });
      localStorage.removeItem('resetPasswordAllowed');
      navigate('/login');
    } catch {
      // тут можно показать сообщение об ошибке
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          placeholder="Введите новый пароль"
        />
        <Input
          type="text"
          placeholder="Введите код из письма"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          name="token"
        />
        <Button htmlType="submit" type="primary" size="medium">
          Сохранить
        </Button>
      </form>

      <div className={styles.hints}>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Link className={styles.link} to="/login">
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
};

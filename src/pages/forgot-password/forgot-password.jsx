import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { requestPasswordReset } from '@utils/api';

import styles from '../auth.module.css';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const onSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await requestPasswordReset(email);
      localStorage.setItem('resetPasswordAllowed', 'true');
      navigate('/reset-password');
    } catch {
      // тут можно показать сообщение об ошибке
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <EmailInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
        />
        <Button htmlType="submit" type="primary" size="medium">
          Восстановить
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

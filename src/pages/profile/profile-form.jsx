import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateUser } from '@services/auth/actions';
import { selectUser } from '@services/auth/slice';

import styles from './profile-form.module.css';

export const ProfileForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const isChanged =
    name !== (user?.name || '') || email !== (user?.email || '') || password !== '';

  const onSubmit = (evt) => {
    evt.preventDefault();
    dispatch(updateUser({ name, email, password }));
    setPassword('');
  };

  const onCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPassword('');
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        name="name"
        icon="EditIcon"
      />
      <EmailInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email"
        isIcon={true}
      />
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        icon="EditIcon"
      />

      {isChanged && (
        <div className={styles.actions}>
          <Button htmlType="button" type="secondary" size="medium" onClick={onCancel}>
            Отмена
          </Button>
          <Button htmlType="submit" type="primary" size="medium">
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};

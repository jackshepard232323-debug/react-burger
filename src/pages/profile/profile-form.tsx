import { Button, EmailInput, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@services/auth/actions';
import { selectUser } from '@services/auth/slice';

import type { FormEvent, ReactElement } from 'react';

import styles from './profile-form.module.css';

const PASSWORD_MIN_LENGTH = 6;

export const ProfileForm = (): ReactElement => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [isNameDisabled, setIsNameDisabled] = useState(true);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(true);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const isPasswordTooShort = password !== '' && password.length < PASSWORD_MIN_LENGTH;

  const isChanged =
    name !== (user?.name || '') || email !== (user?.email || '') || password !== '';

  const onNameIconClick = (): void => {
    setIsNameDisabled(false);
    setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const onNameBlur = (): void => {
    setIsNameDisabled(true);
  };

  const onPasswordIconClick = (): void => {
    setIsPasswordDisabled(false);
    setTimeout(() => passwordInputRef.current?.focus(), 0);
  };

  const onSubmit = async (evt: FormEvent<HTMLFormElement>): Promise<void> => {
    evt.preventDefault();

    if (isPasswordTooShort) {
      return;
    }

    try {
      await dispatch(updateUser({ name, email, password })).unwrap();
      setPassword('');
      setIsPasswordDisabled(true);
    } catch {
      // сервер отклонил — поле остаётся открытым, можно исправить
    }
  };

  const onCancel = (): void => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPassword('');
    setIsPasswordDisabled(true);
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
        ref={nameInputRef}
        onIconClick={onNameIconClick}
        disabled={isNameDisabled}
        onBlur={onNameBlur}
      />
      <EmailInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email"
        isIcon={true}
      />
      <Input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        icon="EditIcon"
        ref={passwordInputRef}
        onIconClick={onPasswordIconClick}
        disabled={isPasswordDisabled}
        error={isPasswordTooShort}
        errorText="Пароль не короче 6 символов"
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

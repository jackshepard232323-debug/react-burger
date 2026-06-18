import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getUserRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  updateUserRequest,
} from '@utils/api';
import { clearTokens, getRefreshToken, saveTokens } from '@utils/tokens';

import type { TLoginForm, TRegisterForm, TUser } from '@utils/types';

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterForm,
  { rejectValue: string }
>('auth/register', async (form, { rejectWithValue }) => {
  try {
    const data = await registerRequest(form);
    saveTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    return data.user;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Не удалось зарегистрироваться';
    return rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk<TUser, TLoginForm, { rejectValue: string }>(
  'auth/login',
  async (form, { rejectWithValue }) => {
    try {
      const data = await loginRequest(form);
      saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return data.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось войти';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await logoutRequest(getRefreshToken());
  } catch {
    // даже если сервер вернул ошибку, выходим локально
  }
  clearTokens();
});

export const checkAuth = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getUserRequest();
      return user;
    } catch (err) {
      clearTokens();
      const message = err instanceof Error ? err.message : 'Сессия недействительна';
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  TRegisterForm,
  { rejectValue: string }
>('auth/update', async (form, { rejectWithValue }) => {
  try {
    const user = await updateUserRequest(form);
    return user;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Не удалось обновить данные';
    return rejectWithValue(message);
  }
});

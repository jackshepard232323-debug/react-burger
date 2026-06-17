import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  loginRequest,
  getUserRequest,
  logoutRequest,
  registerRequest,
  updateUserRequest,
} from '@utils/api';
import { clearTokens, getRefreshToken, saveTokens } from '@utils/tokens';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (form, { rejectWithValue }) => {
    try {
      const data = await registerRequest(form);
      saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return data.user;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Не удалось зарегистрироваться';
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
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
    //даже если серв вернул ощибку, выходим локально
  }
  clearTokens();
});

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getUserRequest();
      return user;
    } catch (err) {
      clearTokens();
      const message = err?.message || 'Сессия недействительна';
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/update',
  async (form, { rejectWithValue }) => {
    try {
      const user = await updateUserRequest(form);
      return user;
    } catch (err) {
      const message = err?.message || 'Не удалось обновить данные';
      return rejectWithValue(message);
    }
  }
);

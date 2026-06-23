import {
  AUTH_LOGIN_ENDPOINT,
  AUTH_LOGOUT_ENDPOINT,
  AUTH_REGISTER_ENDPOINT,
  AUTH_TOKEN_ENDPOINT,
  AUTH_USER_ENDPOINT,
  INGREDIENTS_ENDPOINT,
  ORDERS_ENDPOINT,
  PASSWORD_RESET_CONFIRM_ENDPOINT,
  PASSWORD_RESET_ENDPOINT,
} from './constants';
import { getAccessToken, getRefreshToken, saveTokens } from './tokens';

import type { TIngredient, TLoginForm, TRegisterForm, TUser } from './types';

type TServerResponse = {
  success: boolean;
};

type TIngredientsResponse = {
  data: TIngredient[];
} & TServerResponse;

type TAuthResponse = {
  user: TUser;
  accessToken: string;
  refreshToken: string;
} & TServerResponse;

type TUserResponse = {
  user: TUser;
} & TServerResponse;

type TOrderResponse = {
  name: string;
  order: { number: number };
} & TServerResponse;

type TRefreshResponse = {
  accessToken: string;
  refreshToken: string;
} & TServerResponse;

const parseJsonResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}`);
  }
  return (await res.json()) as T;
};

const unwrapSuccess = <T extends TServerResponse>(payload: T): T => {
  if (!payload.success) {
    throw new Error('Ответ сервера не success');
  }
  return payload;
};

export const getIngredients = async (): Promise<TIngredient[]> => {
  const res = await fetch(INGREDIENTS_ENDPOINT);
  const payload = await parseJsonResponse<TIngredientsResponse>(res);
  return unwrapSuccess(payload).data;
};

export const sendOrder = async (
  ingredientIds: string[]
): Promise<{ name: string; number: number }> => {
  const res = await fetch(ORDERS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients: ingredientIds }),
  });
  const payload = await parseJsonResponse<TOrderResponse>(res);
  const ok = unwrapSuccess(payload);
  return { name: ok.name, number: ok.order.number };
};

export const registerRequest = async (form: TRegisterForm): Promise<TAuthResponse> => {
  const res = await fetch(AUTH_REGISTER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  const payload = await parseJsonResponse<TAuthResponse>(res);
  return unwrapSuccess(payload);
};

export const loginRequest = async (form: TLoginForm): Promise<TAuthResponse> => {
  const res = await fetch(AUTH_LOGIN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  const payload = await parseJsonResponse<TAuthResponse>(res);
  return unwrapSuccess(payload);
};

export const logoutRequest = async (refreshToken: string | null): Promise<void> => {
  const res = await fetch(AUTH_LOGOUT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });
  const payload = await parseJsonResponse<TServerResponse>(res);
  unwrapSuccess(payload);
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  const res = await fetch(PASSWORD_RESET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const payload = await parseJsonResponse<TServerResponse>(res);
  unwrapSuccess(payload);
};

export const confirmPasswordReset = async (data: {
  password: string;
  token: string;
}): Promise<void> => {
  const res = await fetch(PASSWORD_RESET_CONFIRM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const payload = await parseJsonResponse<TServerResponse>(res);
  unwrapSuccess(payload);
};

const checkResponse = async <T extends TServerResponse>(res: Response): Promise<T> => {
  const data = (await res.json()) as T;
  if (!res.ok || !data.success) {
    return Promise.reject(data);
  }
  return data;
};

export const refreshTokenRequest = async (): Promise<TRefreshResponse> => {
  const res = await fetch(AUTH_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: getRefreshToken() }),
  });
  const data = await checkResponse<TRefreshResponse>(res);
  saveTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  return data;
};

const isJwtExpired = (err: unknown): boolean =>
  typeof err === 'object' &&
  err !== null &&
  'message' in err &&
  (err as { message?: string }).message === 'jwt expired';

const fetchWithRefresh = async <T extends TServerResponse>(
  url: string,
  options: RequestInit
): Promise<T> => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if (isJwtExpired(err)) {
      const refreshed = await refreshTokenRequest();
      const res = await fetch(url, {
        ...options,
        headers: { ...options.headers, authorization: refreshed.accessToken },
      });
      return await checkResponse<T>(res);
    }
    return Promise.reject(err);
  }
};

export const getUserRequest = async (): Promise<TUser> => {
  const data = await fetchWithRefresh<TUserResponse>(AUTH_USER_ENDPOINT, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken() ?? '',
    },
  });
  return data.user;
};

export const updateUserRequest = async (form: TRegisterForm): Promise<TUser> => {
  const data = await fetchWithRefresh<TUserResponse>(AUTH_USER_ENDPOINT, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken() ?? '',
    },
    body: JSON.stringify(form),
  });
  return data.user;
};

import {
  AUTH_LOGIN_ENDPOINT,
  AUTH_LOGOUT_ENDPOINT,
  AUTH_REGISTER_ENDPOINT,
  INGREDIENTS_ENDPOINT,
  ORDERS_ENDPOINT,
  PASSWORD_RESET_ENDPOINT,
  PASSWORD_RESET_CONFIRM_ENDPOINT,
  AUTH_TOKEN_ENDPOINT,
  AUTH_USER_ENDPOINT,
} from './constants';
import { getAccessToken, getRefreshToken, saveTokens } from './tokens';

const parseJsonResponse = async (res) => {
  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}`);
  }
  return res.json();
};

const unwrapSuccess = (payload) => {
  if (!payload.success) {
    throw new Error('Ответ сервера не success');
  }
  return payload;
};

export const getIngredients = async () => {
  const res = await fetch(INGREDIENTS_ENDPOINT);
  const payload = await parseJsonResponse(res);
  return unwrapSuccess(payload).data;
};

export const sendOrder = async (ingredientIds) => {
  const res = await fetch(ORDERS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients: ingredientIds }),
  });
  const payload = await parseJsonResponse(res);
  const ok = unwrapSuccess(payload);
  return {
    name: ok.name,
    number: ok.order.number,
  };
};

export const registerRequest = async ({ email, password, name }) => {
  const res = await fetch(AUTH_REGISTER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  const payload = await parseJsonResponse(res);
  const ok = unwrapSuccess(payload);
  return {
    user: ok.user,
    accessToken: ok.accessToken,
    refreshToken: ok.refreshToken,
  };
};

export const loginRequest = async ({ email, password }) => {
  const res = await fetch(AUTH_LOGIN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const payload = await parseJsonResponse(res);
  const ok = unwrapSuccess(payload);
  return {
    user: ok.user,
    accessToken: ok.accessToken,
    refreshToken: ok.refreshToken,
  };
};

export const logoutRequest = async (refreshToken) => {
  const res = await fetch(AUTH_LOGOUT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });
  const payload = await parseJsonResponse(res);
  unwrapSuccess(payload);
};
export const requestPasswordReset = async (email) => {
  const res = await fetch(PASSWORD_RESET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const payload = await parseJsonResponse(res);
  unwrapSuccess(payload);
};

export const confirmPasswordReset = async ({ password, token }) => {
  const res = await fetch(PASSWORD_RESET_CONFIRM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, token }),
  });
  const payload = await parseJsonResponse(res);
  unwrapSuccess(payload);
};
const checkResponse = async (res) => {
  const data = await res.json();
  if (!res.ok || !data.success) {
    return Promise.reject(data);
  }
  return data;
};

export const refreshTokenRequest = async () => {
  const res = await fetch(AUTH_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: getRefreshToken() }),
  });
  const data = await checkResponse(res);
  saveTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  return data;
};

const fetchWithRefresh = async (url, options) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse(res);
  } catch (err) {
    if (err?.message === 'jwt expired') {
      const refreshed = await refreshTokenRequest();
      const res = await fetch(url, {
        ...options,
        headers: { ...options.headers, authorization: refreshed.accessToken },
      });
      return await checkResponse(res);
    }
    return Promise.reject(err);
  }
};

export const getUserRequest = async () => {
  const data = await fetchWithRefresh(AUTH_USER_ENDPOINT, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken(),
    },
  });
  return data.user;
};

export const updateUserRequest = async ({ name, email, password }) => {
  const data = await fetchWithRefresh(AUTH_USER_ENDPOINT, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken(),
    },
    body: JSON.stringify({ name, email, password }),
  });
  return data.user;
};

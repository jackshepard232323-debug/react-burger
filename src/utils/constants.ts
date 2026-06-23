const BASE_HOST = 'https://new-stellarburgers.education-services.ru/api';

export const API_BASE_URL = BASE_HOST;
export const INGREDIENTS_ENDPOINT = `${BASE_HOST}/ingredients`;
export const ORDERS_ENDPOINT = `${BASE_HOST}/orders`;
export const AUTH_REGISTER_ENDPOINT = `${BASE_HOST}/auth/register`;
export const AUTH_LOGIN_ENDPOINT = `${BASE_HOST}/auth/login`;
export const AUTH_LOGOUT_ENDPOINT = `${BASE_HOST}/auth/logout`;
export const AUTH_TOKEN_ENDPOINT = `${BASE_HOST}/auth/token`;
export const AUTH_USER_ENDPOINT = `${BASE_HOST}/auth/user`;
export const PASSWORD_RESET_ENDPOINT = `${BASE_HOST}/password-reset`;
export const PASSWORD_RESET_CONFIRM_ENDPOINT = `${BASE_HOST}/password-reset/reset`;
export const DND_TYPES = {
  ingredient: 'ingredient',
  constructorItem: 'constructor-item',
} as const;

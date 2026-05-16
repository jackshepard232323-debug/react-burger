import { INGREDIENTS_ENDPOINT } from './constants';

const parseJsonResponse = async (res) => {
  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}`);
  }
  return res.json();
};

export const getIngredients = async () => {
  const res = await fetch(INGREDIENTS_ENDPOINT);
  const payload = await parseJsonResponse(res);

  if (!payload.success) {
    throw new Error('Ответ сервера не success');
  }

  return payload.data;
};

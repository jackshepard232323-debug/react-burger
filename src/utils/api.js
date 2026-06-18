import { INGREDIENTS_ENDPOINT, ORDERS_ENDPOINT } from './constants';

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

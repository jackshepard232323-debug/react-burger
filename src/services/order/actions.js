import { createAsyncThunk } from '@reduxjs/toolkit';

import { sendOrder } from '@utils/api';

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const result = await sendOrder(ingredientIds);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось оформить заказ';
      return rejectWithValue(message);
    }
  }
);

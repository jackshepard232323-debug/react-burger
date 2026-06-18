import { createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredients } from '@utils/api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredients();
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Не удалось загрузить ингредиенты';
      return rejectWithValue(message);
    }
  }
);

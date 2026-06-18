import { createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredients } from '@utils/api';

import type { TIngredient } from '@utils/types';

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredients();
    return data;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Не удалось загрузить ингредиенты';
    return rejectWithValue(message);
  }
});

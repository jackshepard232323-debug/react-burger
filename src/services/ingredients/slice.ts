import { createSelector, createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './actions';

import type { TIngredient, TIngredientType } from '@utils/types';

export const REQUEST_STATUS = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
} as const;

type TRequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

type TIngredientsState = {
  items: TIngredient[];
  status: TRequestStatus;
  errorText: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  status: REQUEST_STATUS.idle,
  errorText: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = REQUEST_STATUS.pending;
        state.errorText = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.status = REQUEST_STATUS.resolved;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = REQUEST_STATUS.rejected;
        state.errorText = action.payload || 'Не удалось загрузить ингредиенты';
      });
  },
  selectors: {
    selectAllIngredients: (state) => state.items,
    selectIngredientsStatus: (state) => state.status,
    selectIngredientsError: (state) => state.errorText,
    selectIsLoading: (state) => state.status === REQUEST_STATUS.pending,
    selectIsFailure: (state) => state.status === REQUEST_STATUS.rejected,
  },
});

export const {
  selectAllIngredients,
  selectIngredientsStatus,
  selectIngredientsError,
  selectIsLoading,
  selectIsFailure,
} = ingredientsSlice.selectors;

export const selectIngredientsByCategory = createSelector(
  [selectAllIngredients],
  (items) => {
    const acc: Record<TIngredientType, TIngredient[]> = {
      bun: [],
      sauce: [],
      main: [],
    };
    items.forEach((entry) => {
      acc[entry.type].push(entry);
    });
    return acc;
  }
);

import { createSelector, createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './actions';

const REQUEST_STATUS = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
};

const initialState = {
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
    const acc = { bun: [], sauce: [], main: [] };
    items.forEach((entry) => {
      if (acc[entry.type]) {
        acc[entry.type].push(entry);
      }
    });
    return acc;
  }
);

export { REQUEST_STATUS };

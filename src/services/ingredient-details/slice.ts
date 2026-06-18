import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

type TIngredientDetailsState = {
  current: TIngredient | null;
};

const initialState: TIngredientDetailsState = {
  current: null,
};

export const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.current = action.payload;
    },
    clearCurrentIngredient: () => initialState,
  },
  selectors: {
    selectCurrentIngredient: (state) => state.current,
  },
});

export const { setCurrentIngredient, clearCurrentIngredient } =
  ingredientDetailsSlice.actions;

export const { selectCurrentIngredient } = ingredientDetailsSlice.selectors;

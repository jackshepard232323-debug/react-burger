import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  current: null,
};

export const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action) => {
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

import {
  createSelector,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { TConstructorIngredient, TIngredient } from '@utils/types';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => {
        const payload: TConstructorIngredient = { ...ingredient, uid: nanoid() };
        return { payload };
      },
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const entry = action.payload;
        if (entry.type === 'bun') {
          state.bun = entry;
        } else {
          state.ingredients.push(entry);
        }
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      state.ingredients = state.ingredients.filter((entry) => entry.uid !== uid);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const list = state.ingredients;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= list.length ||
        toIndex >= list.length ||
        fromIndex === toIndex
      ) {
        return;
      }
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
    },
    resetConstructor: () => initialState,
  },
  selectors: {
    selectBun: (state) => state.bun,
    selectConstructorIngredients: (state) => state.ingredients,
  },
});

export const { addIngredient, removeIngredient, moveIngredient, resetConstructor } =
  burgerConstructorSlice.actions;

export const { selectBun, selectConstructorIngredients } =
  burgerConstructorSlice.selectors;

export const selectTotalPrice = createSelector(
  [selectBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const bunCost = bun ? bun.price * 2 : 0;
    const innerCost = ingredients.reduce((acc, entry) => acc + entry.price, 0);
    return bunCost + innerCost;
  }
);

export const selectIngredientCounts = createSelector(
  [selectBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const counts: Record<string, number> = {};
    if (bun) {
      counts[bun._id] = 2;
    }
    ingredients.forEach((entry) => {
      counts[entry._id] = (counts[entry._id] || 0) + 1;
    });
    return counts;
  }
);

export const selectOrderIngredientIds = createSelector(
  [selectBun, selectConstructorIngredients],
  (bun, ingredients) => {
    if (!bun) return [];
    const innerIds = ingredients.map((entry) => entry._id);
    return [bun._id, ...innerIds, bun._id];
  }
);

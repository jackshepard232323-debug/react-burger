import { combineSlices } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from '@services/burger-constructor/slice';
import { ingredientDetailsSlice } from '@services/ingredient-details/slice';
import { ingredientsSlice } from '@services/ingredients/slice';
import { orderSlice } from '@services/order/slice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  ingredientDetailsSlice,
  orderSlice
);

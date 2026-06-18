import { createSlice } from '@reduxjs/toolkit';

import { createOrder } from './actions';

export const ORDER_STATUS = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
} as const;

type TOrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

type TOrderState = {
  number: number | null;
  name: string | null;
  status: TOrderStatus;
  errorText: string | null;
};

const initialState: TOrderState = {
  number: null,
  name: null,
  status: ORDER_STATUS.idle,
  errorText: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = ORDER_STATUS.pending;
        state.errorText = null;
        state.number = null;
        state.name = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = ORDER_STATUS.resolved;
        state.number = action.payload.number;
        state.name = action.payload.name;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = ORDER_STATUS.rejected;
        state.errorText = action.payload || 'Не удалось оформить заказ';
      });
  },
  selectors: {
    selectOrderNumber: (state) => state.number,
    selectOrderName: (state) => state.name,
    selectOrderStatus: (state) => state.status,
    selectOrderError: (state) => state.errorText,
    selectOrderIsPending: (state) => state.status === ORDER_STATUS.pending,
  },
});

export const { clearOrder } = orderSlice.actions;
export const {
  selectOrderNumber,
  selectOrderName,
  selectOrderStatus,
  selectOrderError,
  selectOrderIsPending,
} = orderSlice.selectors;

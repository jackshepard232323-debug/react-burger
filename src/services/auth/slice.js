import { createSlice } from '@reduxjs/toolkit';

import { checkAuth, loginUser, logoutUser, registerUser, updateUser } from './actions';

const initialState = {
  user: null,
  isAuthChecked: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthenticated: (state) => state.user !== null,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectAuthError: (state) => state.error,
  },
});

export const { setAuthChecked } = authSlice.actions;

export const {
  selectUser,
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectAuthError,
} = authSlice.selectors;

// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSignedIn: false,
    userId: null,
  };
  

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.userId = action.payload;
      state.isSignedIn = true;
    },
    signOut: (state) => {
      state.userId = null;
      state.isSignedIn = false;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;

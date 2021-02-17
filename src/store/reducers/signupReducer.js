import { createSlice } from '@reduxjs/toolkit';

export const signupSlice = createSlice({
  name: 'signup',

  initialState: {
    email: '',
    password: '',
  },
  reducers: {
    _setEmail: (state, action) => {
      state.email = action.payload;
    },
    _setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
});

export default signupSlice.reducer;

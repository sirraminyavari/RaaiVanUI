import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
  name: 'auth',

  initialState: {
    isFetching: false,
    login: null,
    email: '',
    password: '',
  },
  reducers: {
    loginAction: (state, action) => {
      state.isFetching = true;
    },
    loginResult: (state, action) => {
      state.login = action.payload;
      state.isFetching = false;
    },
    loginFailed: (state, action) => {
      state.error = action.payload;
      state.isFetching = false;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
});

export default loginSlice.reducer;

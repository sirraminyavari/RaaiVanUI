import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
  name: 'auth',

  initialState: {
    isFetching: false,
    login: null,
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
  },
});

export default loginSlice.reducer;

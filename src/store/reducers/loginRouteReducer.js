import { createSlice } from '@reduxjs/toolkit';

export const loginRouteSlice = createSlice({
  name: 'loginRoute',

  initialState: {
    currentRoute: 'login',
  },
  reducers: {
    changeLoginRoute: (state, action) => {
      state.currentRoute = action.payload;
    },
  },
});

export default loginRouteSlice.reducer;

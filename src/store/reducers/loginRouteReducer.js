import { createSlice } from '@reduxjs/toolkit';
import { SIGN_IN } from 'constant/LoginRoutes';

export const loginRouteSlice = createSlice({
  name: 'loginRoute',

  initialState: {
    currentRoute: SIGN_IN,
  },
  reducers: {
    changeLoginRoute: (state, action) => {
      state.currentRoute = action.payload;
    },
  },
});

export default loginRouteSlice.reducer;

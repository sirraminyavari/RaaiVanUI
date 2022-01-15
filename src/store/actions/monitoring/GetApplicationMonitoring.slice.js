import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stores: {},
  store: {},
};

const slice = createSlice({
  name: 'getApplicationMonitoringReducer',
  initialState,
  reducers: {
    GET_Apps_Monitoring: (state, action) => {
      state.stores = action.payload;
    },
    GET_App_Monitoring: (state, action) => {
      state.store = action.payload;
    },
  },
});

export const { GET_Apps_Monitoring, GET_App_Monitoring } = slice.actions;

export default slice.reducer;

import { createSlice } from '@reduxjs/toolkit';

export const domainsSlice = createSlice({
  name: 'auth',
  loading: false,
  login: null,
  initialState: {},
  reducers: {
    getDomainsAction: (state, action) => {
      state.loading = true;
    },
    getDomainsResponse: (state, action) => {
      state.domainsList = action.payload;
      state.loading = false;
    },
    getDomainsFailed: (state, action) => {
      state.error = action.payload;
    },
  },
});

export default domainsSlice.reducer;

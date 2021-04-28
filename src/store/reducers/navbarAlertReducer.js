import { createSlice } from '@reduxjs/toolkit';

const alerts = [
  {
    id: '1',
    userName: 'Mr. Nobody',
    title:
      'شما را مخاطب قرار داده است شما را مخاطب قرار داده است شما را مخاطب قرار داده است',
  },
  {
    id: '2',
    userName: 'Mr. Nobody',
    title: 'شما را مخاطب قرار داده است',
  },
  {
    id: '3',
    userName: 'Mr. Nobody',
    title: 'شما را مخاطب قرار داده است',
  },
  {
    id: '4',
    userName: 'Mr. Nobody',
    title: 'شما را مخاطب قرار داده است',
  },
  {
    id: '5',
    userName: 'Mr. Nobody',
    title: 'شما را مخاطب قرار داده است',
  },
  {
    id: '6',
    userName: 'Mr. Nobody',
    title: 'شما را مخاطب قرار داده است',
  },
  {
    id: '7',
    userName: 'Mr. Nobody',
    title: 'شما را مخاطب قرار داده است',
  },
];

//! Nav Alert Slice
export const navAlertSlice = createSlice({
  name: 'nav-alert',
  initialState: {
    alertsList: alerts,
    offset: 0,
    currentPage: 0,
    perPage: 3,
    totalPage: Math.ceil(alerts.length / 3),
    isLastPage: false,
    isFirstPage: true,
  },
  reducers: {
    setNextPage: (state, action) => {
      if (state.totalPage > state.currentPage + 1) {
        state.currentPage = state.currentPage + 1;
        state.offset = state.currentPage * state.perPage;
      }
    },
    setPrevPage: (state, actioon) => {
      if (state.currentPage > 0) {
        state.currentPage = state.currentPage - 1;
        state.offset = state.currentPage * state.perPage;
      }
    },
    setReadAll: (state, actioon) => {
      state.currentPage = 0;
      state.offset = 0;
      state.alertsList = [];
    },
  },
});

export default navAlertSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

//! Notifications Slice
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notificationsList: [],
    notificationsCount: 0,
    offset: 0,
    currentPage: 0,
    perPage: 3,
    totalPage: 0,
    isLastPage: false,
    isFirstPage: true,
  },
  reducers: {
    setNextPage: (state, action) => {
      if (state.totalPage > state.currentPage + 1) {
        state.currentPage = state.currentPage + 1;
        state.offset = state.currentPage * state.perPage;
      }
      if (state.totalPage === state.currentPage + 1) {
        state.isLastPage = true;
      }
      if (state.totalPage > state.currentPage + 1) {
        state.isFirstPage = false;
      }
    },
    setPrevPage: (state, actioon) => {
      if (state.currentPage > 0) {
        state.currentPage = state.currentPage - 1;
        state.offset = state.currentPage * state.perPage;
      }
      if (state.currentPage === 0) {
        state.isFirstPage = true;
      }
      if (state.totalPage > state.currentPage + 1) {
        state.isLastPage = false;
      }
    },
    setReadAll: (state, actioon) => {
      state.currentPage = 0;
      state.offset = 0;
      state.notificationsList = [];
    },
    setNotificationsCount: (state, action) => {
      state.notificationsCount = action.payload;
    },
    setNotificationsList: (state, action) => {
      state.notificationsList = action.payload;
      state.totalPage = Math.ceil(
        (action.payload || []).length / state.perPage
      );
    },
  },
});

export default notificationsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

//! Notifications Slice
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notificationsList: [],
    notificationsCount: 0,
    isFetchingNotifsList: false,
  },
  reducers: {
    setReadAll: (state, actioon) => {
      state.notificationsList = [];
    },
    setNotificationsCount: (state, action) => {
      state.notificationsCount = action.payload;
    },
    setNotificationsList: (state, action) => {
      state.notificationsList = action.payload;
    },
    setIsFetchingNotifsList: (state, action) => {
      state.isFetchingNotifsList = action.payload;
    },
  },
});

export default notificationsSlice.reducer;

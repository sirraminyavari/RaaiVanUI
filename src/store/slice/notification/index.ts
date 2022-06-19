import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { notificationsSaga } from './saga';

import { EmptyNotificationState, INotificationState, INotifID } from './types';
import { PayloadAction } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'notifications',
  initialState: EmptyNotificationState,
  reducers: {
    setReadAll: (state: INotificationState, action: PayloadAction<any>) => {
      state.notificationsList = [];
    },
    getNotificationsCount: (state: INotificationState) => {},
    setNotificationsCount: (
      state: INotificationState,
      action: PayloadAction<number>
    ) => {
      state.notificationsCount = action.payload;
    },
    getNotifications: (
      state: INotificationState,
      action: PayloadAction<{ Count?: number }>
    ) => {},
    setNotificationsList: (
      state: INotificationState,
      action: PayloadAction<any[]>
    ) => {
      state.notificationsList = action.payload;
    },
    setIsFetchingNotifsList: (
      state: INotificationState,
      action: PayloadAction<boolean>
    ) => {
      state.isFetchingNotifsList = action.payload;
    },
    removeNotification: (
      state: INotificationState,
      action: PayloadAction<INotifID>
    ) => {},
    setNotificationsAsSeen: (
      state: INotificationState,
      action: PayloadAction<{ NotificationIDs: string[] }>
    ) => {},
  },
});

export const { actions: notificationActions } = slice;

export const useNotificationsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: notificationsSaga });
  return { actions: slice.actions };
};

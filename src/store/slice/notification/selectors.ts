import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types/RootState';
import { EmptyNotificationState } from './types';

const selectSlice = (state: RootState) =>
  state?.notifications || EmptyNotificationState;

export const selectNotifications = createSelector(
  [selectSlice],
  (state) => state
);

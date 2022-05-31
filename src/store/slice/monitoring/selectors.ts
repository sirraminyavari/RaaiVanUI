import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types/RootState';
import { EmptyMonitoringState } from './types';

const selectSlice = (state: RootState) =>
  state?.monitoring || EmptyMonitoringState;

export const selectSidebar = createSelector([selectSlice], (state) => state);

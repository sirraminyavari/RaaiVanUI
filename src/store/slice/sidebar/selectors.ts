import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types/RootState';
import { EmptySidebarState } from './types';

const selectSlice = (state: RootState) =>
  state?.sidebarItems || EmptySidebarState;

export const selectSidebar = createSelector([selectSlice], (state) => state);

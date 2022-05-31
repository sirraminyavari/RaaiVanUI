import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types/RootState';
import { EmptyApplicationState } from './types';

export const selectApplicationSlice = (state: RootState) =>
  state?.applications || EmptyApplicationState;

export const selectApplication = createSelector(
  [selectApplicationSlice],
  (state) => state
);

import { createSelector } from '@reduxjs/toolkit';

export const selectApplicationSlice = (state) => state?.application;

export const selectApplication = createSelector(
  [selectApplicationSlice],
  (state) => state
);

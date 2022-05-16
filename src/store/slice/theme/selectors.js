import { createSelector } from '@reduxjs/toolkit';

const selectSlice = (state) => state?.theme;

export const selectTheme = createSelector([selectSlice], (state) => state);

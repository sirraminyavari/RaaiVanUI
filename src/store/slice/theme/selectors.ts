import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types/RootState';

const selectSlice = (state: RootState) => state.theme;

export const selectTheme = createSelector([selectSlice], (state) => state);

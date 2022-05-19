import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types/RootState';
import { EmptyThemeState } from './types';

const selectSlice = (state: RootState) => state?.theme || EmptyThemeState;

export const selectTheme = createSelector([selectSlice], (state) => state);

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types/RootState';
import { EmptyThemeState, IThemeState } from './types';

export const selectThemeSlice = (state: RootState): IThemeState =>
  state?.theme || EmptyThemeState;

export const selectTheme = createSelector([selectThemeSlice], (state) => state);

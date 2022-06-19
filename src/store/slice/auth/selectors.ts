import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types/RootState';
import { EmptyAuthState } from './types';

export const selectAuthSlice = (state: RootState) =>
  state?.auth || EmptyAuthState;

export const selectAuth = createSelector([selectAuthSlice], (state) => state);

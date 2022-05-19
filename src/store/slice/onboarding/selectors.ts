import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { EmptyOnboardingState } from './types';

const selectSlice = (state: RootState) =>
  state?.onboarding || EmptyOnboardingState;

export const selectOnboarding = createSelector([selectSlice], (state) => state);

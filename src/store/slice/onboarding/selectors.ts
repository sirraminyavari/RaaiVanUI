import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { EmptyOnboardingState } from './types';

export const selectOnboardingSlice = (state: RootState) =>
  state?.onboarding || EmptyOnboardingState;

export const selectOnboarding = createSelector(
  [selectOnboardingSlice],
  (state) => state
);

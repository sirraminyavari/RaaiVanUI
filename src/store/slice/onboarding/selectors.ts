import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { EmptyOnboardingState, IOnboardingState } from './types';

export const selectOnboardingSlice = (state: RootState): IOnboardingState =>
  state?.onboarding || EmptyOnboardingState;

export const selectOnboarding = createSelector(
  [selectOnboardingSlice],
  (state) => state
);

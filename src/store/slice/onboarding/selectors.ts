import { createSelector } from '@reduxjs/toolkit';

const selectSlice = (state) => state?.onboarding;

export const selectOnboarding = createSelector([selectSlice], (state) => state);

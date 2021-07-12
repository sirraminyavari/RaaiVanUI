import { createSlice } from '@reduxjs/toolkit';

//! Onboarding Slice
export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    name: '',
    fromStep: 0,
  },
  reducers: {
    onboardingName: (state, action) => {
      state.name = action.payload;
    },
    onboardingStep: (state, action) => {
      state.fromStep = action.payload;
    },
  },
});

export default onboardingSlice.reducer;

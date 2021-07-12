import { createSlice } from '@reduxjs/toolkit';

// Theme Slice
export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    name: '_',
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

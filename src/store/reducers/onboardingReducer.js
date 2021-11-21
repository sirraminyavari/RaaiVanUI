import { createSlice } from '@reduxjs/toolkit';

//! Onboarding Slice
export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    name: '',
    newDocMenu: '',
    fromStep: 0,
    active: false,
  },
  reducers: {
    onboardingName: (state, action) => {
      state.name = action.payload;
    },
    onboardingStep: (state, action) => {
      state.fromStep = action.payload;
    },
    setNewDocMenu: (state, action) => {
      state.newDocMenu = action.payload;
    },
    toggleActivation: (state) => {
      console.log(state, '***** state *****');
      state.active = !state.active;
    },
  },
});

export const {
  onboardingName,
  onboardingStep,
  setNewDocMenu,
  toggleActivation,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;

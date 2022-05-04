import { createSlice } from '@reduxjs/toolkit';

//! Onboarding Slice
export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    name: '',
    newDocMenu: '',
    fromStep: 0,
    active: false,
    teamName: undefined,
    templates: [],
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
    setOnboardingTeamName: (state, action) => {
      state.teamName = action.payload;
    },
    setOnboardingTemplates: (state, action) => {
      console.log({ action });
      state.templates = action.payload;
    },
    setOnboardingTemplateStatusCompleted: (state, action) => {
      state.templates = state.templates.map((template) => {
        if (template.NodeTypeID !== action.payload) return template;
        else return { ...template, isSetupComplete: true };
      });
    },
  },
});

export const {
  onboardingName,
  onboardingStep,
  setNewDocMenu,
  toggleActivation,
  setOnboardingTeamName,
  setOnboardingTemplates,
  setOnboardingTemplateStatusCompleted,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;

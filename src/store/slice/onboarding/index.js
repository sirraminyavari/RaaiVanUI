import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { onboardingSaga } from './saga';

const slice = createSlice({
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

export const { actions: onboardingActions } = slice;

export const useOnboardingSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: onboardingSaga });
  return { actions: slice.actions };
};

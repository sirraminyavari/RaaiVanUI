import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { onboardingSaga } from './saga';
import { EmptyOnboardingState, IOnboardingState } from './types';

const slice = createSlice({
  name: 'onboarding',
  initialState: EmptyOnboardingState,
  reducers: {
    onboardingName: (state: IOnboardingState, action: PayloadAction<any>) => {
      state.name = action.payload;
    },
    onboardingStep: (state: IOnboardingState, action: PayloadAction<any>) => {
      state.fromStep = action.payload;
    },
    setNewDocMenu: (state: IOnboardingState, action: PayloadAction<any>) => {
      state.newDocMenu = action.payload;
    },
    toggleActivation: (state: IOnboardingState, action: PayloadAction<any>) => {
      console.log(state, '***** state *****');
      state.active = !state.active;
    },
    setOnboardingTeamName: (
      state: IOnboardingState,
      action: PayloadAction<any>
    ) => {
      state.teamName = action.payload;
    },
    setOnboardingTemplates: (
      state: IOnboardingState,
      action: PayloadAction<any>
    ) => {
      console.log({ action });
      state.templates = action.payload;
    },
    setOnboardingTemplateStatusCompleted: (
      state: IOnboardingState,
      action: PayloadAction<any>
    ) => {
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

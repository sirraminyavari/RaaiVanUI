import { PayloadAction } from '@reduxjs/toolkit';
import { useInjectSaga } from 'redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { onboardingSaga } from './saga';
import {
  EmptyOnboardingState,
  IOnboardingState,
  ISetFieldOfExpertiseRequest,
} from './types';

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
    toggleActivation: (state: IOnboardingState) => {
      state.active = !state.active;
    },
    setOnboardingTeamName: (
      state: IOnboardingState,
      action: PayloadAction<any>
    ) => {
      state.teamName = action.payload.TeamName;
      state.applicationID = action.payload.ApplicationID;

      (window.RVGlobal || {}).ApplicationID = action.payload.ApplicationID;
      (window.RVGlobal || {}).IsSystemAdmin = action.payload.IsSystemAdmin;
    },
    setOnboardingProductTourStatus: (state, action) => {
      state.showProductTour = action.payload;
    },
    setOnboardingTemplates: (
      state: IOnboardingState,
      action: PayloadAction<any>
    ) => {
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

    setTeamName: (
      _state: IOnboardingState,
      _action: PayloadAction<{ WorkspaceID?: string; TeamName: string }>
    ) => {},
    setTeamSize: (
      _state: IOnboardingState,
      _action: PayloadAction<{ Size: string }>
    ) => {},
    setTeamSizeSuccessful: (
      state: IOnboardingState,
      action: PayloadAction<{ ApplicationID: string; IsSystemAdmin: boolean }>
    ) => {
      (window.RVGlobal || {}).ApplicationID = action.payload.ApplicationID;
      (window.RVGlobal || {}).IsSystemAdmin = action.payload.IsSystemAdmin;
    },
    setFieldOfExpertise: (
      _state: IOnboardingState,
      _action: PayloadAction<ISetFieldOfExpertiseRequest>
    ) => {},

    teamCreationChoice: (state: IOnboardingState) => {
      Object.entries({ ...EmptyOnboardingState }).forEach(
        (ent) => (state[ent[0]] = ent[1])
      );
    },
    teamSetName: (state: IOnboardingState) => {
      state.componentName = 'set-name';
      state.nextStepAction = 'set-people-count';
      state.disableContinue = state.teamState.teamName === '';
      state.loading = false;
      state.apiName = 'teamName';
      state.activeStep = 1;
      state.stepsCount = 3;
    },
    teamSetPeopleCount: (state: IOnboardingState) => {
      state.componentName = 'people-count';
      state.nextStepAction = 'set-work-field';
      state.disableContinue = !state.teamState.peopleCount;
      state.loading = false;
      state.apiName = 'teamSize';
      state.activeStep = 2;
      state.stepsCount = 3;
    },
    teamSetWorkField: (state: IOnboardingState) => {
      state.componentName = 'work-field';
      state.nextStepAction = 'team-creation-completed';
      state.disableContinue = !state.teamState.workField.fieldID;
      state.loading = false;
      state.apiName = 'fieldOfExpertise';
      state.activeStep = 3;
      state.stepsCount = 3;
    },
    teamCreationCompleted: (state: IOnboardingState) => {
      state.completed = true;
    },
    teamTemplateSelection: (state: IOnboardingState) => {
      state.completed = false;
    },
    teamSetState: (
      state: IOnboardingState,
      action: PayloadAction<{ key: string; value: any }>
    ) => {
      state.disableContinue =
        action.payload.value === '' || action.payload.value?.fieldID === '';
      state.teamState[action.payload.key] = action.payload.value;
    },
    teamSetApplicationId: (
      state: IOnboardingState,
      action: PayloadAction<string>
    ) => {
      state.applicationID = action.payload;
    },
    teamSetWorkspaceId: (
      state: IOnboardingState,
      action: PayloadAction<string>
    ) => {
      state.WorkspaceID = action.payload;
    },
    setLoading: (state: IOnboardingState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTeamTemplate: (
      state: IOnboardingState,
      action: PayloadAction<{ id: string; value: any }>
    ) => {
      const templates = {
        ...state.selectedTemplates,
        [action.payload.id]: action.payload.value,
      };
      state.selectedTemplates = templates;
      state.disableContinue = !Object.keys(templates).length;
    },
    setTeamDefaultTemplate: (
      state: IOnboardingState,
      action: PayloadAction<{ [x: string]: any }>
    ) => {
      state.selectedTemplates = action.payload;
      state.disableContinue = !Object.keys(action.payload).length;
    },
    teamRemoveTemplate: (
      state: IOnboardingState,
      action: PayloadAction<{ id: string }>
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload.id]: removableTemplate, ...templates } =
        state.selectedTemplates;
      state.selectedTemplates = templates;
      state.disableContinue = !Object.keys(templates).length;
    },
    teamRemoveAllTemplates: (state: IOnboardingState) => {
      state.selectedTemplates = {};
      state.disableContinue = true;
    },
    goToNextOnboardingStep: (_state: IOnboardingState, _action) => {},
  },
});

export const { actions: onboardingActions } = slice;

export const useOnboardingSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: onboardingSaga });
  return { actions: slice.actions };
};

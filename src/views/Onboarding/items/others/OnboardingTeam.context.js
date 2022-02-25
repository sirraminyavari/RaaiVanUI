import { createContext, useReducer, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import OnboardingTeamCreationChoiceContent from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationChoiceContent';
import OnboardingTeamCreationSetNameContent from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationSetNameContent';
import OnboardingTeamCreationSetNameBanner from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationSetNameBanner';
import OnboardingTeamCreationSetPeopleCountContent from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationSetPeopleCountContent';
import OnboardingTeamCreationSetPeopleCountBanner from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationSetPeopleCountBanner';
import OnboardingTeamCreationSetWorkFieldContent from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationSetWorkFieldContent';
import OnboardingTeamCreationSetWorkFieldBanner from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationSetWorkFieldBanner';
import { ONBOARDING_TEMPLATE_PATH } from './constants';
import {
  onboardingTeamNameSave,
  onboardingTeamPeopleCountSave,
} from './OnboardingTeamApiCalls';

//! Context Action Types
const ONBOARDING_TEAM_SET_STATE = 'ONBOARDING_TEAM_SET_STATE';
const ONBOARDING_TEAM_SET_LOADING = 'ONBOARDING_TEAM_SET_LOADING';
const ONBOARDING_TEAM_SET_APPLICATION_ID = 'ONBOARDING_TEAM_SET_APPLICATION_ID';
const ONBOARDING_TEAM_CREATION_CHOICE = 'ONBOARDING_TEAM_CREATION_CHOICE';
const ONBOARDING_TEAM_CREATION_SET_NAME = 'ONBOARDING_TEAM_CREATION_SET_NAME';
const ONBOARDING_TEAM_CREATION_SET_PEOPLE_COUNT =
  'ONBOARDING_TEAM_CREATION_SET_PEOPLE_COUNT';
const ONBOARDING_TEAM_CREATION_SET_WORK_FIELD =
  'ONBOARDING_TEAM_CREATION_SET_WORK_FIELD';
const ONBOARDING_TEAM_COMPLETED = 'ONBOARDING_TEAM_COMPLETED';

export const OnboardingTeamStepContext = createContext();

//! Reducer's initial state
const initialState = {
  BannerComponent: null,
  ContentComponent: OnboardingTeamCreationChoiceContent,
  nextStepAction: ONBOARDING_TEAM_CREATION_SET_NAME,
  stepsCount: null,
  applicationID: null,
  disableContinue: true,
  completed: false,
  apiCall: () => {},
  teamState: {
    loading: false,
    teamName: '',
    peopleCount: '',
    workField: '',
  },
};

export const stepperReducer = (prevState, { stateKey, stateValue, type }) => {
  switch (type) {
    case ONBOARDING_TEAM_CREATION_CHOICE:
      return {
        ...prevState,
        ...initialState,
      };
    case ONBOARDING_TEAM_CREATION_SET_NAME:
      return {
        ...prevState,
        BannerComponent: OnboardingTeamCreationSetNameBanner,
        ContentComponent: OnboardingTeamCreationSetNameContent,
        nextStepAction: ONBOARDING_TEAM_CREATION_SET_PEOPLE_COUNT,
        disableContinue: prevState.teamState.teamName === '',
        loading: false,
        apiCall: ({ dispatch, teamState }) =>
          new Promise(async (resolve) => {
            await onboardingTeamNameSave({
              dispatch,
              teamName: teamState.teamName,
            });
            resolve();
          }),
        activeStep: 1,
        stepsCount: 3,
      };
    case ONBOARDING_TEAM_CREATION_SET_PEOPLE_COUNT:
      return {
        ...prevState,
        BannerComponent: OnboardingTeamCreationSetPeopleCountBanner,
        ContentComponent: OnboardingTeamCreationSetPeopleCountContent,
        nextStepAction: ONBOARDING_TEAM_CREATION_SET_WORK_FIELD,
        disableContinue: prevState.teamState.peopleCount === '',
        loading: false,
        apiCall: ({ dispatch, teamState }) =>
          new Promise(async (resolve) => {
            await onboardingTeamPeopleCountSave({
              dispatch,
              ApplicationID: prevState.applicationID,
              Size: teamState.peopleCount,
            });
            resolve();
          }),
        activeStep: 2,
        stepsCount: 3,
      };
    case ONBOARDING_TEAM_CREATION_SET_WORK_FIELD:
      return {
        ...prevState,
        BannerComponent: OnboardingTeamCreationSetWorkFieldBanner,
        ContentComponent: OnboardingTeamCreationSetWorkFieldContent,
        nextStepAction: ONBOARDING_TEAM_COMPLETED,
        disableContinue: prevState.teamState.workField === '',
        loading: false,
        apiCall: ({ dispatch, teamState }) => {},
        activeStep: 3,
        stepsCount: 3,
      };
    case ONBOARDING_TEAM_COMPLETED:
      return { ...initialState, completed: true };

    case ONBOARDING_TEAM_SET_STATE:
      return {
        ...prevState,
        disableContinue: stateValue === '',
        teamState: {
          ...prevState.teamState,
          [stateKey]: stateValue,
        },
      };

    case ONBOARDING_TEAM_SET_APPLICATION_ID:
      return {
        ...prevState,
        applicationID: stateValue,
      };

    case ONBOARDING_TEAM_SET_LOADING:
      return {
        ...prevState,
        loading: stateValue,
      };
    default:
      return prevState;
  }
};

export const OnboardingTeamStepContextActions = {
  ONBOARDING_TEAM_SET_STATE,
  ONBOARDING_TEAM_SET_LOADING,
  ONBOARDING_TEAM_SET_APPLICATION_ID,
  ONBOARDING_TEAM_CREATION_SET_NAME,
  ONBOARDING_TEAM_CREATION_CHOICE,
  ONBOARDING_TEAM_CREATION_SET_PEOPLE_COUNT,
  ONBOARDING_TEAM_CREATION_SET_WORK_FIELD,
};

export function OnboardingTeamStepContextProvider({ children }) {
  const history = useHistory();
  const [states, dispatch] = useReducer(stepperReducer, initialState);

  useEffect(() => {
    // console.log({ states });
    if (states.completed) history.push(ONBOARDING_TEMPLATE_PATH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states]);

  return (
    <OnboardingTeamStepContext.Provider value={{ ...states, dispatch }}>
      {children}
    </OnboardingTeamStepContext.Provider>
  );
}

export const useOnboardingTeamContent = () =>
  useContext(OnboardingTeamStepContext);

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

const ONBOARDING_TEAM_SET_STATE = 'ONBOARDING_TEAM_SET_STATE';
const ONBOARDING_TEAM_CREATION_CHOICE = 'ONBOARDING_TEAM_CREATION_CHOICE';
const ONBOARDING_TEAM_CREATION_SET_NAME = 'ONBOARDING_TEAM_CREATION_SET_NAME';
const ONBOARDING_TEAM_CREATION_SET_PEOPLE_COUNT =
  'ONBOARDING_TEAM_CREATION_SET_PEOPLE_COUNT';
const ONBOARDING_TEAM_CREATION_SET_WORK_FIELD =
  'ONBOARDING_TEAM_CREATION_SET_WORK_FIELD';
const ONBOARDING_TEAM_COMPLETED = 'ONBOARDING_TEAM_COMPLETED';

export const OnboardingTeamStepContext = createContext();

const initialState = {
  BannerComponent: null,
  ContentComponent: OnboardingTeamCreationChoiceContent,
  nextStepAction: ONBOARDING_TEAM_CREATION_SET_NAME,
  stepsCount: null,
  disableContinue: true,
  teamState: {
    teamName: '',
    peopleCount: '',
    workField: '',
  },
};

const HistoryPush = (path) => {
  const history = useHistory();
  history.push(path);
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
        activeStep: 3,
        stepsCount: 3,
      };
    case ONBOARDING_TEAM_COMPLETED:
      HistoryPush(ONBOARDING_TEMPLATE_PATH);
      return { ...prevState, nextStepAction: undefined };
    case ONBOARDING_TEAM_SET_STATE:
      return {
        ...prevState,
        disableContinue: stateValue === '',
        teamState: {
          ...prevState.teamState,
          [stateKey]: stateValue,
        },
      };
    default:
      return prevState;
  }
};

export const OnboardingTeamStepContextActions = {
  ONBOARDING_TEAM_SET_STATE,
  ONBOARDING_TEAM_CREATION_SET_NAME,
  ONBOARDING_TEAM_CREATION_CHOICE,
  ONBOARDING_TEAM_CREATION_SET_PEOPLE_COUNT,
  ONBOARDING_TEAM_CREATION_SET_WORK_FIELD,
};

export function OnboardingTeamStepContextProvider({ children }) {
  const [states, dispatch] = useReducer(stepperReducer, initialState);
  useEffect(() => {
    console.log({ states });
  }, [states]);
  return (
    <OnboardingTeamStepContext.Provider value={{ ...states, dispatch }}>
      {children}
    </OnboardingTeamStepContext.Provider>
  );
}

export const useOnboardingTeamContent = () =>
  useContext(OnboardingTeamStepContext);

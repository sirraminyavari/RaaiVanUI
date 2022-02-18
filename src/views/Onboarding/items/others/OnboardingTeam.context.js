import { createContext, useReducer, useContext, useEffect } from 'react';
import OnboardingTeamCreationChoiceContent from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationChoiceContent';
import OnboardingTeamCreationSetNameContent from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationSetNameContent';
import OnboardingTeamCreationSetNameBanner from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationSetNameBanner';
import OnboardingTeamCreationSetPeopleCountContent from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationSetPeopleCountContent';
import OnboardingTeamCreationSetPeopleCountBanner from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationSetPeopleCountBanner';
import OnboardingTeamCreationSetWorkFieldContent from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationSetWorkFieldContent';
import OnboardingTeamCreationSetWorkFieldBanner from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationSetWorkFieldBanner';

const ONBOARDING_TEAM_SET_STATE = 'ONBOARDING_TEAM_SET_STATE';
const ONBOARDING_TEAM_CREATION_CHOICE = 'ONBOARDING_TEAM_CREATION_CHOICE';
const ONBOARDING_TEAM_CREATION_SET_NAME = 'ONBOARDING_TEAM_CREATION_SET_NAME';
const ONBOARDING_TEAM_CREATION_SET_PEOPLE_COUNT =
  'ONBOARDING_TEAM_CREATION_SET_PEOPLE_COUNT';
const ONBOARDING_TEAM_CREATION_SET_WORK_FIELD =
  'ONBOARDING_TEAM_CREATION_SET_WORK_FIELD';

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
        nextStepAction: ONBOARDING_TEAM_CREATION_SET_NAME,
        disableContinue: prevState.teamState.workField === '',
        activeStep: 3,
        stepsCount: 3,
      };
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

import React from 'react';
import OnboardingTeamCreationChoiceContent from 'views/Onboarding/items/content/OnboardingTeam/OnboardingTeamCreationChoiceContent';

const ONBOARDING_TEAM_CREATION_SET_NAME = 'ONBOARDING_TEAM_CREATION_SET_NAME';

export interface IOnboardingState {
  //product tour
  name: string;
  newDocMenu: string;
  fromStep: number;
  active: boolean;
  teamName?: string;
  templates: any[];
  showProductTour: boolean;
  //end of: product tour

  //onboarding
  BannerComponent: React.FC | null;
  ContentComponent: React.FC;
  nextStepAction: any;
  activeStep?: number;
  stepsCount?: number;
  WorkspaceID?: string;
  applicationID?: string;
  disableContinue: boolean;
  completed: boolean;
  loading: boolean;
  apiName?: 'fieldOfExpertise' | 'teamSize' | 'teamName';
  teamState: {
    loading: boolean;
    teamName: string;
    peopleCount: string;
    workField: {
      fieldID: string;
      fieldName: string;
    };
  };
  selectedTemplates: any;
  //end of: onboarding
}

export const EmptyOnboardingState: IOnboardingState = {
  name: '',
  newDocMenu: '',
  fromStep: 0,
  active: false,
  teamName: undefined,
  templates: [],
  showProductTour: true,

  BannerComponent: null,
  ContentComponent: OnboardingTeamCreationChoiceContent,
  nextStepAction: ONBOARDING_TEAM_CREATION_SET_NAME,
  activeStep: undefined,
  stepsCount: undefined,
  WorkspaceID: undefined,
  applicationID: undefined,
  disableContinue: true,
  completed: false,
  loading: false,
  apiName: undefined,
  teamState: {
    loading: false,
    teamName: '',
    peopleCount: '',
    workField: {
      fieldID: '',
      fieldName: '',
    },
  },
  selectedTemplates: {},
};

interface ISetFieldOfExpertiseRequest {
  applicationId: string;
  teamName: string;
  fieldOfExpertise: {
    id?: string;
    name?: string;
  };
  showProductTour?: boolean;
}

export type { ISetFieldOfExpertiseRequest };

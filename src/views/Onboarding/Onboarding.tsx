import React, { lazy } from 'react';
import WithSuspense from 'components/WithSuspense/WithSuspense';
import { Redirect, Route } from 'react-router-dom';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';
import {
  ONBOARDING_PATH,
  ONBOARDING_USER_INFO_PATH,
  ONBOARDING_USER_TEAM_PATH,
  ONBOARDING_TEMPLATE_PATH,
  ONBOARDING_TEMPLATE_SELECTION_PATH,
  ONBOARDING_TEMPLATE_SETUP_PATH,
} from './items/others/constants';
import { OnboardingTeamStepContextProvider } from './items/others/OnboardingTeam.context';

//TODO a permanent fix is needed for the  () => JSX.Element type accepted by <Route/> component ...

const OnboardingIntroductionView = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "onboarding-introduction-view"*/ 'views/Onboarding/OnboardingIntroductionView'
      )
  )
);

const OnboardingUserInfoView = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "onboarding-user-info-view"*/ 'views/Onboarding/OnboardingUserInfoView'
      )
  )
);

const OnboardingTeamView = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "onboarding-team-view"*/ 'views/Onboarding/OnboardingTeamView'
      )
  )
);

const OnboardingTemplateView = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "onboarding-template-view"*/ 'views/Onboarding/OnboardingTemplateView'
      )
  )
);

const OnboardingTemplateSelectionView = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "onboarding-template-selection-view"*/ 'views/Onboarding/OnboardingTemplateSelectionView'
      )
  )
);

const OnboardingTemplateSetupView = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "onboarding-template-setup-view"*/ 'views/Onboarding/OnboardingTemplateSetupView'
      )
  )
);

const OnboardingView = () => {
  return (
    <>
      <OnboardingTeamStepContextProvider>
        <TransitionSwitchWrapper>
          <Route
            exact
            path={ONBOARDING_PATH}
            component={
              OnboardingIntroductionView as unknown as () => JSX.Element
            }
          />
          <Route
            exact
            path={ONBOARDING_USER_INFO_PATH}
            component={OnboardingUserInfoView as unknown as () => JSX.Element}
          />
          <Route
            exact
            path={ONBOARDING_TEMPLATE_SELECTION_PATH}
            component={
              OnboardingTemplateSelectionView as unknown as () => JSX.Element
            }
          />
          <Route
            exact
            path={ONBOARDING_TEMPLATE_SETUP_PATH}
            component={
              OnboardingTemplateSetupView as unknown as () => JSX.Element
            }
          />
          <Route
            exact
            path={ONBOARDING_TEMPLATE_PATH}
            component={OnboardingTemplateView as unknown as () => JSX.Element}
          />
          <Route
            path={ONBOARDING_USER_TEAM_PATH}
            component={OnboardingTeamView as unknown as () => JSX.Element}
          />
          <Redirect to={ONBOARDING_PATH} />
        </TransitionSwitchWrapper>
      </OnboardingTeamStepContextProvider>
    </>
  );
};

export default OnboardingView;

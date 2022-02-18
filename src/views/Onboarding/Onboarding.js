import { lazy } from 'react';
import WithSuspense from 'components/WithSuspense/WithSuspense';
import { Redirect, Route } from 'react-router-dom';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';
import {
  ONBOARDING_PATH,
  ONBOARDING_USER_INFO_PATH,
  ONBOARDING_USER_TEAM_PATH,
} from './items/others/constants';
import { OnboardingTeamStepContextProvider } from './items/others/OnboardingTeam.context';

const OnboardingIntroductionView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "onboarding-introduction-view"*/ 'views/Onboarding/OnboardingIntroductionView'
    )
  )
);

const OnboardingUserInfoView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "onboarding-user-info-view"*/ 'views/Onboarding/OnboardingUserInfoView'
    )
  )
);

const OnboardingTeamView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "onboarding-user-info-view"*/ 'views/Onboarding/OnboardingTeamView'
    )
  )
);

const OnboardingView = () => {
  return (
    <>
      <TransitionSwitchWrapper>
        <Route
          exact
          path={ONBOARDING_PATH}
          component={OnboardingIntroductionView}
        />
        <Route
          exact
          path={ONBOARDING_USER_INFO_PATH}
          component={OnboardingUserInfoView}
        />
        <OnboardingTeamStepContextProvider>
          <Route
            path={ONBOARDING_USER_TEAM_PATH}
            component={OnboardingTeamView}
          />
        </OnboardingTeamStepContextProvider>
        <Redirect to={ONBOARDING_PATH} />
      </TransitionSwitchWrapper>
    </>
  );
};

export default OnboardingView;

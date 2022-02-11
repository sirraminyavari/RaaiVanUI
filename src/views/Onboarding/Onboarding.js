import { lazy } from 'react';
import WithSuspense from 'components/WithSuspense/WithSuspense';
import { Redirect, Route } from 'react-router-dom';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';
import { ONBOARDING_PATH } from './items/others/constants';

const OnboardingIntroductionView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "onboarding-introduction-view"*/ 'views/Onboarding/OnboardingIntroductionView'
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
        <Redirect to={ONBOARDING_PATH} />
      </TransitionSwitchWrapper>
    </>
  );
};

export default OnboardingView;

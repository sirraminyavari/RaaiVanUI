import { useMemo } from 'react';
import * as Styles from './OnboardingTeam.styles';
import useWindow from 'hooks/useWindowContext';
import Stepper from 'views/Onboarding/items/others/Stepper/Stepper';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';
import { useOnboardingTeamContent } from 'views/Onboarding/items/others/OnboardingTeam.context';
import WelcomeLayout from 'layouts/WelcomeLayout';
import Button from 'components/Buttons/Button';

const OnboardingTeamContent = () => {
  const { RVDic } = useWindow();
  const {
    ContentComponent,
    BannerComponent,
    stepsCount,
    activeStep,
    nextStepAction,
    disableContinue,
    dispatch,
  } = useOnboardingTeamContent();

  const goToNextStep = useMemo(
    () => () => {
      dispatch({ type: nextStepAction });
    },
    [nextStepAction]
  );

  //! RVDic i18n localization
  const RVDicSaveAndNext = RVDic.SaveAndNext;
  return (
    <>
      <TransitionSwitchWrapper key={activeStep}>
        <WelcomeLayout noFullHeight noOutline>
          {ContentComponent && (
            <>
              <ContentComponent />
            </>
          )}
          {BannerComponent && (
            <>
              <BannerComponent />
            </>
          )}
        </WelcomeLayout>
      </TransitionSwitchWrapper>
      {stepsCount && (
        <Styles.OnboardingTeamActionButtonWrapper>
          <Button
            style={{ paddingInline: '4rem' }}
            onClick={goToNextStep}
            disable={disableContinue}
          >
            {RVDicSaveAndNext}
          </Button>
          <Stepper stepsCount={stepsCount} activeStep={activeStep} />
        </Styles.OnboardingTeamActionButtonWrapper>
      )}
    </>
  );
};

OnboardingTeamContent.displayName = 'OnboardingTeamContent';

export default OnboardingTeamContent;

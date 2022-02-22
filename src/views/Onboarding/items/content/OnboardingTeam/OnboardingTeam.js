import { useMemo } from 'react';
import * as Styles from './OnboardingTeam.styles';
import useWindow from 'hooks/useWindowContext';
import Stepper from 'components/Stepper/Stepper';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';
import {
  useOnboardingTeamContent,
  OnboardingTeamStepContextActions,
} from 'views/Onboarding/items/others/OnboardingTeam.context';
import WelcomeLayout from 'layouts/WelcomeLayout';
import Button from 'components/Buttons/Button';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const OnboardingTeamContent = () => {
  const { RVDic } = useWindow();
  const { isTabletOrMobile } = DimensionHelper();
  const {
    ContentComponent,
    BannerComponent,
    stepsCount,
    activeStep,
    nextStepAction,
    disableContinue,
    dispatch,
  } = useOnboardingTeamContent();

  const goToStep = (stepActionType) => {
    dispatch({ type: stepActionType });
  };

  const StepArguments = [
    {
      onClick: () =>
        goToStep(
          OnboardingTeamStepContextActions.ONBOARDING_TEAM_CREATION_SET_NAME
        ),
    },
    {
      onClick: () =>
        goToStep(
          OnboardingTeamStepContextActions.ONBOARDING_TEAM_CREATION_SET_PEOPLE_COUNT
        ),
    },
    {
      onClick: () =>
        goToStep(
          OnboardingTeamStepContextActions.ONBOARDING_TEAM_CREATION_SET_WORK_FIELD
        ),
    },
  ];

  const goToNextStep = useMemo(
    () => () => {
      dispatch({ type: nextStepAction });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nextStepAction]
  );

  //! RVDic i18n localization
  const RVDicSaveAndNext = RVDic.SaveAndNext;
  return (
    <>
      <Styles.OnboardingTeamWelcomeLayoutWrapper>
        <TransitionSwitchWrapper transitionKey={activeStep}>
          <WelcomeLayout noFullHeight noOutline style={{ width: '100%' }}>
            {ContentComponent && (
              <>
                <ContentComponent />
              </>
            )}
            {BannerComponent && !isTabletOrMobile && (
              <>
                <BannerComponent />
              </>
            )}
          </WelcomeLayout>
        </TransitionSwitchWrapper>
      </Styles.OnboardingTeamWelcomeLayoutWrapper>
      {stepsCount && (
        <Styles.OnboardingTeamActionButtonWrapper>
          <Button
            style={{ paddingInline: '4rem' }}
            onClick={goToNextStep}
            disable={disableContinue}
          >
            {RVDicSaveAndNext}
          </Button>
          <Stepper
            stepsCount={stepsCount}
            activeStep={activeStep}
            stepArguments={StepArguments}
          />
        </Styles.OnboardingTeamActionButtonWrapper>
      )}
    </>
  );
};

OnboardingTeamContent.displayName = 'OnboardingTeamContent';

export default OnboardingTeamContent;

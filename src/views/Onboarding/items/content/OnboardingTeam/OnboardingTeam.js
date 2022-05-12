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
    apiCall,
    loading,
    dispatch,
    teamState,
  } = useOnboardingTeamContent();

  const goToStep = async (stepActionType) => {
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
    () => async () => {
      dispatch({
        type: OnboardingTeamStepContextActions.ONBOARDING_TEAM_SET_LOADING,
        stateKey: 'loading',
        stateValue: true,
      });

      try {
        if (apiCall) await apiCall({ dispatch, teamState });
        dispatch({ type: nextStepAction });
      } catch (error) {
        alert(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nextStepAction, teamState]
  );

  //! RVDic i18n localization
  const RVDicSaveAndNext = RVDic.SaveAndNext;
  return (
    <Styles.OnboardingTeamContentContainer>
      <Styles.OnboardingTeamWelcomeLayoutWrapper
        noFixedHeight={[null].includes(stepsCount)}
      >
        <TransitionSwitchWrapper transitionKey={activeStep}>
          <WelcomeLayout
            centerize={[3, null].includes(stepsCount)}
            noFullHeight
            noOutline
            style={{
              width: '100%',
              marginBlockStart: 0,
              minHeight: 'calc(100vh - 15rem)',
            }}
          >
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
            loading={loading}
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
    </Styles.OnboardingTeamContentContainer>
  );
};

OnboardingTeamContent.displayName = 'OnboardingTeamContent';

export default OnboardingTeamContent;

import * as Styles from './OnboardingTeam.styles';
import useWindow from 'hooks/useWindowContext';
import Stepper from 'components/Stepper/Stepper';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';
import WelcomeLayout from 'layouts/WelcomeLayout';
import Button from 'components/Buttons/Button';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import { useOnboardingSlice } from 'store/slice/onboarding';
import { useDispatch, useSelector } from 'react-redux';
import { selectOnboarding } from 'store/slice/onboarding/selectors';
import OnboardingTeamCreationSetNameBanner from './OnboardingTeamCreationSetNameBanner';
import OnboardingTeamCreationSetPeopleCountBanner from './OnboardingTeamCreationSetPeopleCountBanner';
import OnboardingTeamCreationSetWorkFieldBanner from './OnboardingTeamCreationSetWorkFieldBanner';
import OnboardingTeamCreationSetWorkFieldContent from './OnboardingTeamCreationSetWorkFieldContent';
import OnboardingTeamCreationSetPeopleCountContent from './OnboardingTeamCreationSetPeopleCountContent';
import OnboardingTeamCreationSetNameContent from './OnboardingTeamCreationSetNameContent';
import OnboardingTeamCreationChoiceContent from './OnboardingTeamCreationChoiceContent';

const OnboardingTeamContent = () => {
  const { RVDic } = useWindow();
  const { isTabletOrMobile } = DimensionHelper();

  const dispatch = useDispatch();

  const { stepsCount, activeStep, disableContinue, loading, componentName } =
    useSelector(selectOnboarding);

  const { actions: onboardingActions } = useOnboardingSlice();

  const StepArguments = [
    {
      onClick: () => dispatch(onboardingActions.teamSetName()),
    },
    {
      onClick: () => dispatch(onboardingActions.teamSetPeopleCount()),
    },
    {
      onClick: () => dispatch(onboardingActions.teamSetWorkField()),
    },
  ];

  const goToNextStep = () =>
    dispatch(onboardingActions.goToNextOnboardingStep());

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
            singleColumn={isTabletOrMobile}
            style={{
              width: '100%',
              marginBlockStart: 0,
              minHeight: 'calc(100vh - 15rem)',
              ...(isTabletOrMobile
                ? {}
                : {
                    flexDirection: 'row-reverse',
                  }),
            }}
          >
            {componentName === 'set-name' && (
              <OnboardingTeamCreationSetNameBanner sticky={!isTabletOrMobile} />
            )}
            {componentName === 'people-count' && (
              <OnboardingTeamCreationSetPeopleCountBanner
                sticky={!isTabletOrMobile}
              />
            )}
            {componentName === 'work-field' && (
              <OnboardingTeamCreationSetWorkFieldBanner
                sticky={!isTabletOrMobile}
              />
            )}
            {componentName === 'choice' && (
              <OnboardingTeamCreationChoiceContent />
            )}
            {componentName === 'set-name' && (
              <OnboardingTeamCreationSetNameContent />
            )}
            {componentName === 'people-count' && (
              <OnboardingTeamCreationSetPeopleCountContent />
            )}
            {componentName === 'work-field' && (
              <OnboardingTeamCreationSetWorkFieldContent />
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

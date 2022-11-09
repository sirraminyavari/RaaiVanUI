import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import { useDispatch, useSelector } from 'react-redux';
import { useOnboardingSlice } from 'store/slice/onboarding';
import { selectOnboarding } from 'store/slice/onboarding/selectors';

const OnboardingTeamCreationSetNameContent = () => {
  const { RVDic } = useWindow();
  const { isTabletOrMobile } = DimensionHelper();

  const dispatch = useDispatch();

  const {
    teamState: { teamName },
  } = useSelector(selectOnboarding);

  const { actions: onboardingActions } = useOnboardingSlice();

  //! RVDic i18n localization
  const RVDicِYourTeamName = RVDic.TeamName;
  const RVDicِTeamName = RVDic.TeamName;
  const RVDicِTeamNameDescription =
    RVDic.Checks.EnterANameForTheTeamYouWantToCreate;

  const setTeamName = (teamName) => {
    dispatch(
      onboardingActions.teamSetState({ key: 'teamName', value: teamName })
    );
  };

  return (
    <>
      <>
        <Styles.OnboardingTeamTitleWrapper>
          {RVDicِYourTeamName}
        </Styles.OnboardingTeamTitleWrapper>
        <Styles.OnboardingTeamTitleDescription>
          {RVDicِTeamNameDescription}
        </Styles.OnboardingTeamTitleDescription>
        <Styles.OnboardingTeamInputWrapper isMobile={isTabletOrMobile}>
          <AnimatedInput
            //@ts-ignore
            style={{ fontSize: '1rem' }}
            value={teamName}
            onChange={setTeamName}
            placeholder={RVDicِTeamName}
            maxLength={64}
          />
        </Styles.OnboardingTeamInputWrapper>
      </>
    </>
  );
};

OnboardingTeamCreationSetNameContent.displayName =
  'OnboardingTeamCreationSetNameContent';

export default OnboardingTeamCreationSetNameContent;

import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import {
  useOnboardingTeamContent,
  OnboardingTeamStepContextActions,
} from 'views/Onboarding/items/others/OnboardingTeam.context';

const OnboardingTeamCreationSetNameContent = () => {
  const { dispatch: dispatchTeam, teamState } = useOnboardingTeamContent();
  const { RVDic } = useWindow();

  //TODO update RVDic i18n
  //! RVDic i18n localization
  const RVDicِYourTeamName = RVDic.TeamName;
  const RVDicِTeamName = RVDic.TeamName;
  const RVDicِTeamNameDescription =
    '.برای تیمی که قصد ایجاد آن را دارید، یک نام وارد کنید';

  const setTeamName = (teamName) => {
    dispatchTeam({
      type: OnboardingTeamStepContextActions.ONBOARDING_TEAM_SET_STATE,
      stateKey: 'teamName',
      stateValue: teamName,
    });
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
        <Styles.OnboardingTeamInputWrapper>
          <AnimatedInput
            style={{ fontSize: '1rem' }}
            value={teamState.teamName}
            onChange={setTeamName}
            placeholder={RVDicِTeamName}
          />
        </Styles.OnboardingTeamInputWrapper>
      </>
    </>
  );
};

OnboardingTeamCreationSetNameContent.displayName =
  'OnboardingTeamCreationSetNameContent';

export default OnboardingTeamCreationSetNameContent;

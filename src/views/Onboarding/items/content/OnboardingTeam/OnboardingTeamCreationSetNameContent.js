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

  //! RVDic i18n localization
  const RVDicِYourTeamName = RVDic.TeamName;
  const RVDicِTeamName = RVDic.TeamName;

  const setTeamName = (teamName) => {
    dispatchTeam({
      type: OnboardingTeamStepContextActions.ONBOARDING_TEAM_SET_STATE,
      stateKey: 'teamName',
      stateValue: teamName,
    });
  };

  return (
    <>
      <div>
        <Styles.OnboardingTeamTitleWrapper>
          {RVDicِYourTeamName}
        </Styles.OnboardingTeamTitleWrapper>
        <Styles.OnboardingTeamInputWrapper>
          <AnimatedInput
            value={teamState.teamName}
            onChange={setTeamName}
            placeholder={RVDicِTeamName}
          />
        </Styles.OnboardingTeamInputWrapper>
      </div>
    </>
  );
};

OnboardingTeamCreationSetNameContent.displayName =
  'OnboardingTeamCreationSetNameContent';

export default OnboardingTeamCreationSetNameContent;

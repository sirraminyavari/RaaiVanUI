import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import Heading from 'components/Heading/Heading';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import {
  useOnboardingTeamContent,
  OnboardingTeamStepContextActions,
} from 'views/Onboarding/items/others/OnboardingTeam.context';

const OnboardingTeamCreationSetNameContent = () => {
  const { dispatch: dispatchTeam, teamState } = useOnboardingTeamContent();
  const { RVDic } = useWindow();

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicِYourTeamName = `نام تیم شما`;
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
        <Heading type="h2">{RVDicِYourTeamName}</Heading>
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

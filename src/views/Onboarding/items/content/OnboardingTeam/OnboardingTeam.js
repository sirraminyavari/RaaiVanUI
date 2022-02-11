import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import { ONBOARDING_USER_INFO_PATH } from '../../others/constants';
import ShadowButton from 'components/Buttons/ShadowButton';
import TeamIcon from 'components/Icons/TeamIcon/TeamIcon';

const OnboardingTeamContent = () => {
  const { RVDic } = useWindow();
  const history = useHistory();

  //! RVDic i18n localization
  const RVDicCreateNewTeam = RVDic.CreateNewN.replace('[n]', RVDic.Team);
  const RVDicJoinTeam = 'عضو تیم هستم';

  return (
    <Styles.OnboardingTeamWrapper>
      <Styles.OnboardingTeamFlatPanelButtonGroup>
        <Styles.OnboardingTeamFlatPanelButton>
          <TeamIcon />
          {RVDicJoinTeam}
        </Styles.OnboardingTeamFlatPanelButton>
        <Styles.OnboardingTeamFlatPanelButton>
          <TeamIcon />
          {RVDicCreateNewTeam}
        </Styles.OnboardingTeamFlatPanelButton>
      </Styles.OnboardingTeamFlatPanelButtonGroup>
    </Styles.OnboardingTeamWrapper>
  );
};

OnboardingTeamContent.displayName = 'OnboardingTeamContent';

export default OnboardingTeamContent;

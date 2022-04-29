import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import * as GlobalStyles from 'views/Onboarding/items/Onboarding.styles';
import TeamMemberIcon from 'components/Icons/TeamMemberIcon/TeamMemberIcon';
import PanelButton from 'components/Buttons/PanelButton';
import NewTeamIcon from 'components/Icons/NewTeamIcon/NewTeamIcon';
import { useOnboardingTeamContent } from 'views/Onboarding/items/others/OnboardingTeam.context';
import { useMemo } from 'react';

const OnboardingTeamCreationChoiceContent = () => {
  const { RVDic } = useWindow();
  const history = useHistory();
  const { dispatch: dispatchTeamPage, nextStepAction } =
    useOnboardingTeamContent();

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicCreateNewTeam = RVDic.CreateNewN.replace('[n]', RVDic.Team);
  const RVDicAlreadyInATeam = 'عضو تیم هستم';
  const RVDicPageDescriptionInfo =
    '.اگر از طریق ایمیل یا لینک دعوت به تیمی دعوت شده‌اید و قصد ورود به تیم را دارید، از گزینه عضو تیم هستم استفاده کنید .و درصورتی که قصد ایجاد یک تیم جدید را دارید، از گزینه ساخت تیم جدید استفاده کنید';

  const goToTheDefaultEntranceRoute = () => history.push('/');

  const goToNextStep = useMemo(
    () => () => {
      dispatchTeamPage({ type: nextStepAction });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nextStepAction]
  );

  return (
    <>
      <GlobalStyles.OnboardingCenterizeContent>
        <Styles.OnboardingTeamDescriptionWrapper>
          {RVDicPageDescriptionInfo}
        </Styles.OnboardingTeamDescriptionWrapper>
        <Styles.OnboardingTeamFlatPanelButtonGroup>
          <PanelButton onClick={goToTheDefaultEntranceRoute}>
            <TeamMemberIcon />
            {RVDicAlreadyInATeam}
          </PanelButton>
          <PanelButton onClick={goToNextStep}>
            <NewTeamIcon />
            {RVDicCreateNewTeam}
          </PanelButton>
        </Styles.OnboardingTeamFlatPanelButtonGroup>
      </GlobalStyles.OnboardingCenterizeContent>
    </>
  );
};

OnboardingTeamCreationChoiceContent.displayName =
  'OnboardingTeamCreationChoiceContent';

export default OnboardingTeamCreationChoiceContent;

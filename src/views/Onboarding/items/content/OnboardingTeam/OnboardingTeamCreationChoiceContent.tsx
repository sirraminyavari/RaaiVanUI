import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import * as GlobalStyles from 'views/Onboarding/items/Onboarding.styles';
import TeamMemberIcon from 'components/Icons/TeamMemberIcon/TeamMemberIcon';
import NewTeamIcon from 'components/Icons/NewTeamIcon/NewTeamIcon';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import { useOnboardingSlice } from 'store/slice/onboarding';
import { selectOnboarding } from 'store/slice/onboarding/selectors';

const OnboardingTeamCreationChoiceContent = () => {
  const { RVDic } = useWindow();
  const history = useHistory();
  const location = useLocation();
  const { isMobile } = DimensionHelper();

  const dispatch = useDispatch();

  const { nextStepAction } = useSelector(selectOnboarding);

  const { actions: onboardingActions } = useOnboardingSlice();

  //! RVDic i18n localization
  const RVDicCreateNewTeam = RVDic.CreateNewN.replace('[n]', RVDic.Team);
  const RVDicAlreadyInATeam = RVDic.IAmATeamMember;
  const RVDicPageDescriptionInfo = RVDic._HelpOnboardingTeamSelection;

  useEffect(() => {
    const UrlQuery = new URLSearchParams(location.search);
    const workspaceID = UrlQuery.get('workspaceID');
    if (workspaceID !== null) {
      dispatch(onboardingActions.teamSetWorkspaceId(workspaceID));
      goToNextStep();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToTheDefaultEntranceRoute = () => history.push('/');

  const goToNextStep = useMemo(
    () => () => {
      if (!!nextStepAction) dispatch(nextStepAction());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nextStepAction]
  );

  return (
    <>
      <GlobalStyles.OnboardingCenterizeContent isMobile={isMobile}>
        <Styles.OnboardingTeamDescriptionWrapper>
          {RVDicPageDescriptionInfo}
        </Styles.OnboardingTeamDescriptionWrapper>
        <Styles.OnboardingTeamFlatPanelButtonGroup>
          <Styles.OnboardingTeamHugePanelButton
            onClick={goToTheDefaultEntranceRoute}
          >
            <TeamMemberIcon />
            {RVDicAlreadyInATeam}
          </Styles.OnboardingTeamHugePanelButton>
          <Styles.OnboardingTeamHugePanelButton onClick={goToNextStep}>
            <NewTeamIcon />
            {RVDicCreateNewTeam}
          </Styles.OnboardingTeamHugePanelButton>
        </Styles.OnboardingTeamFlatPanelButtonGroup>
      </GlobalStyles.OnboardingCenterizeContent>
    </>
  );
};

OnboardingTeamCreationChoiceContent.displayName =
  'OnboardingTeamCreationChoiceContent';

export default OnboardingTeamCreationChoiceContent;

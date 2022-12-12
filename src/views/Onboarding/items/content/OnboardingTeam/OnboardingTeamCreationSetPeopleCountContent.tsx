import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import TeamMemberCountIcon from 'components/Icons/TeamMemberIcon/TeamMemberCountIcon';
import PanelButton from 'components/Buttons/PanelButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectOnboarding } from 'store/slice/onboarding/selectors';
import { useOnboardingSlice } from 'store/slice/onboarding';

const OnboardingTeamCreationSetPeopleCountContent = () => {
  const { RVDic } = useWindow();

  const dispatch = useDispatch();

  const {
    teamState: { teamName, peopleCount },
  } = useSelector(selectOnboarding);

  const { actions: onboardingActions } = useOnboardingSlice();

  //! RVDic i18n localization
  const RVDicِYourTeamHeadCount = RVDic.TeamSize;
  const RVDicِYourTeamHeadCountDescription =
    RVDic.WhatIsTheSizeOfTeamNInYourOrganization.replace('[n]', teamName);
  const RVDicLessThan10People = RVDic.LessThanN.replace(
    '[n]',
    RVDic.NPeople.replace('[n]', 10)
  );
  const RVDicBetween11To20People = RVDic.NToMPeople.replace('[n]', 11).replace(
    '[m]',
    20
  );
  const RVDicMoreThan20People = RVDic.MoreThanN.replace(
    '[n]',
    RVDic.NPeople.replace('[n]', 20)
  );

  const setOnboardingTeamPeopleCount = (peopleCount) => () => {
    dispatch(
      onboardingActions.teamSetState({ key: 'peopleCount', value: peopleCount })
    );
  };

  return (
    <>
      <Styles.OnboardingTeamTitleWrapper>
        {RVDicِYourTeamHeadCount}
      </Styles.OnboardingTeamTitleWrapper>
      <Styles.OnboardingTeamTitleDescription>
        {RVDicِYourTeamHeadCountDescription}
      </Styles.OnboardingTeamTitleDescription>
      <Styles.OnboardingTeamButtonInputWrapper wrap>
        <PanelButton
          secondary
          active={peopleCount === 'lessThan10'}
          onClick={setOnboardingTeamPeopleCount('lessThan10')}
        >
          <TeamMemberCountIcon membersCount="lessThan10" size={'1em'} />
          <Styles.OnboardingPanelButtonLabel>
            {RVDicLessThan10People}
          </Styles.OnboardingPanelButtonLabel>
        </PanelButton>
        <PanelButton
          secondary
          active={peopleCount === 'between11To20'}
          onClick={setOnboardingTeamPeopleCount('between11To20')}
        >
          <TeamMemberCountIcon membersCount="between11To20" size={'1em'} />
          <Styles.OnboardingPanelButtonLabel>
            {RVDicBetween11To20People}
          </Styles.OnboardingPanelButtonLabel>
        </PanelButton>
        <PanelButton
          secondary
          active={peopleCount === 'moreThan20'}
          onClick={setOnboardingTeamPeopleCount('moreThan20')}
        >
          <TeamMemberCountIcon membersCount="moreThan20" size={'1em'} />
          <Styles.OnboardingPanelButtonLabel>
            {RVDicMoreThan20People}
          </Styles.OnboardingPanelButtonLabel>
        </PanelButton>
      </Styles.OnboardingTeamButtonInputWrapper>
    </>
  );
};

OnboardingTeamCreationSetPeopleCountContent.displayName =
  'OnboardingTeamCreationSetPeopleCountContent';

export default OnboardingTeamCreationSetPeopleCountContent;

import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import TeamMemberCountIcon from 'components/Icons/TeamMemberIcon/TeamMemberCountIcon';
import PanelButton from 'components/Buttons/PanelButton';
import {
  useOnboardingTeamContent,
  OnboardingTeamStepContextActions,
} from 'views/Onboarding/items/others/OnboardingTeam.context';

const OnboardingTeamCreationSetPeopleCountContent = () => {
  const { RVDic } = useWindow();

  const {
    dispatch: dispatchTeamPage,
    teamState: { peopleCount },
  } = useOnboardingTeamContent();

  //TODO update RVDic i18n
  //! RVDic i18n localization
  const RVDicِYourTeamHeadCount = RVDic.TeamSize;
  const RVDicِYourTeamHeadCountDescription =
    'اندازه تیم **نام تیم** در سازمان شما چند نفر است؟';
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
    dispatchTeamPage({
      type: OnboardingTeamStepContextActions.ONBOARDING_TEAM_SET_STATE,
      stateKey: 'peopleCount',
      stateValue: peopleCount,
    });
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
          {RVDicLessThan10People}
        </PanelButton>
        <PanelButton
          secondary
          active={peopleCount === 'between11To20'}
          onClick={setOnboardingTeamPeopleCount('between11To20')}
        >
          <TeamMemberCountIcon membersCount="between11To20" size={'1em'} />
          {RVDicBetween11To20People}
        </PanelButton>
        <PanelButton
          secondary
          active={peopleCount === 'moreThan20'}
          onClick={setOnboardingTeamPeopleCount('moreThan20')}
        >
          <TeamMemberCountIcon membersCount="moreThan20" size={'1em'} />
          {RVDicMoreThan20People}
        </PanelButton>
      </Styles.OnboardingTeamButtonInputWrapper>
    </>
  );
};

OnboardingTeamCreationSetPeopleCountContent.displayName =
  'OnboardingTeamCreationSetPeopleCountContent';

export default OnboardingTeamCreationSetPeopleCountContent;

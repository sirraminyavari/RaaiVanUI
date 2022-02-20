import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import Heading from 'components/Heading/Heading';
import TeamMemberCountIcon from 'components/Icons/TeamMemberIcon/TeamMemberCountIcon';
import PanelButton from 'components/Buttons/PanelButton';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import {
  useOnboardingTeamContent,
  OnboardingTeamStepContextActions,
} from 'views/Onboarding/items/others/OnboardingTeam.context';

const OnboardingTeamCreationSetPeopleCountContent = () => {
  const { RVDic } = useWindow();
  const { isMobile } = DimensionHelper();

  const {
    dispatch: dispatchTeamPage,
    teamState: { peopleCount },
  } = useOnboardingTeamContent();

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicِYourTeamHeadCount = `تعداد افراد تیم شما`;
  const RVDicLessThan10People = `کمتر از 10 نفر`;
  const RVDicBetween11To20People = `11 تا 20 نفر`;
  const RVDicMoreThan20People = `بیشتر از 20 نفر`;

  const setOnboardingTeamPeopleCount = (peopleCount) => () => {
    dispatchTeamPage({
      type: OnboardingTeamStepContextActions.ONBOARDING_TEAM_SET_STATE,
      stateKey: 'peopleCount',
      stateValue: peopleCount,
    });
  };

  return (
    <>
      <Heading type="h2">{RVDicِYourTeamHeadCount}</Heading>
      <Styles.OnboardingTeamButtonInputWrapper isMobile={isMobile}>
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

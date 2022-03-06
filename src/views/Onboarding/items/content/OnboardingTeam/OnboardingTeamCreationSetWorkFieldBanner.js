import * as Styles from './OnboardingTeam.styles';
import * as lessThan10Images from 'assets/images/onboarding/illustration/lessThen10/lessThen10';
import * as between11To20Images from 'assets/images/onboarding/illustration/between11To20/between11To20';
import * as moreThan20Images from 'assets/images/onboarding/illustration/moreThan20/moreThan20';
import { useOnboardingTeamContent } from 'views/Onboarding/items/others/OnboardingTeam.context';

const OnboardingTeamCreationSetWorkFieldBanner = () => {
  const { teamState } = useOnboardingTeamContent();
  const PeopleCountImages = () => {
    if (teamState.peopleCount === 'moreThan20') return moreThan20Images;
    else if (teamState.peopleCount === 'between11To20')
      return between11To20Images;
    else return lessThan10Images;
  };
  const workFieldBannerImage = (workField) => {
    return PeopleCountImages()[workField];
  };

  return (
    <Styles.OnboardingTeamImageBannerWrapper
      BackgroundImage={workFieldBannerImage(teamState.workField)}
    >
      <div />
    </Styles.OnboardingTeamImageBannerWrapper>
  );
};

OnboardingTeamCreationSetWorkFieldBanner.displayName =
  'OnboardingTeamCreationSetWorkFieldBanner';

export default OnboardingTeamCreationSetWorkFieldBanner;

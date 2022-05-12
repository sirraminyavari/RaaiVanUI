import * as Styles from './OnboardingTeam.styles';
import { OTHERS as lessThan10Image } from 'assets/images/onboarding/illustration/lessThen10/lessThen10';
import { OTHERS as between11To20Image } from 'assets/images/onboarding/illustration/between11To20/between11To20';
import { OTHERS as moreThan20Image } from 'assets/images/onboarding/illustration/moreThan20/moreThan20';
import { useOnboardingTeamContent } from 'views/Onboarding/items/others/OnboardingTeam.context';

const OnboardingTeamCreationSetPeopleCountBanner = () => {
  const { teamState } = useOnboardingTeamContent();
  const peopleCountImageSrc = (peopleCount) => {
    switch (peopleCount) {
      case 'between11To20':
        return between11To20Image;
      case 'moreThan20':
        console.log(peopleCount);
        return moreThan20Image;
      default:
        return lessThan10Image;
    }
  };
  return (
    <Styles.OnboardingTeamImageBannerWrapper
      BackgroundImage={peopleCountImageSrc(teamState.peopleCount)}
    >
      <div />
    </Styles.OnboardingTeamImageBannerWrapper>
  );
};

OnboardingTeamCreationSetPeopleCountBanner.displayName =
  'OnboardingTeamCreationSetPeopleCountBanner';

export default OnboardingTeamCreationSetPeopleCountBanner;

import * as Styles from './OnboardingTeam.styles';
import { OTHERS as lessThan10Image } from 'assets/images/onboarding/illustration/lessThen10/lessThen10';
import { OTHERS as between11To20Image } from 'assets/images/onboarding/illustration/between11To20/between11To20';
import { OTHERS as moreThan20Image } from 'assets/images/onboarding/illustration/moreThan20/moreThan20';
import { useOnboardingTeamContent } from 'views/Onboarding/items/others/OnboardingTeam.context';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const OnboardingTeamCreationSetPeopleCountBanner = () => {
  const { teamState } = useOnboardingTeamContent();
  const { isMobile } = DimensionHelper();
  const peopleCountImageSrc = (
    peopleCount: 'between11To20' | 'moreThan20' | 'lessThan10'
  ) => {
    switch (peopleCount) {
      case 'between11To20':
        return between11To20Image;
      case 'moreThan20':
        return moreThan20Image;
      default:
        return lessThan10Image;
    }
  };
  return (
    <Styles.OnboardingTeamImageBannerWrapper
      isMobile={isMobile}
      BackgroundImage={peopleCountImageSrc(teamState.peopleCount)}
    >
      <div />
    </Styles.OnboardingTeamImageBannerWrapper>
  );
};

OnboardingTeamCreationSetPeopleCountBanner.displayName =
  'OnboardingTeamCreationSetPeopleCountBanner';

export default OnboardingTeamCreationSetPeopleCountBanner;

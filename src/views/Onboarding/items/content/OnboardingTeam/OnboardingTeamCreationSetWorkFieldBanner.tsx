import * as Styles from './OnboardingTeam.styles';
import * as lessThan10Images from 'assets/images/onboarding/illustration/lessThen10/lessThen10';
import * as between11To20Images from 'assets/images/onboarding/illustration/between11To20/between11To20';
import * as moreThan20Images from 'assets/images/onboarding/illustration/moreThan20/moreThan20';
import { useOnboardingTeamContent } from 'views/Onboarding/items/others/OnboardingTeam.context';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const OnboardingTeamCreationSetWorkFieldBanner = () => {
  const { teamState } = useOnboardingTeamContent();
  const { isMobile } = DimensionHelper();
  const PeopleCountImages = () => {
    if (teamState.peopleCount === 'moreThan20') return moreThan20Images;
    else if (teamState.peopleCount === 'between11To20')
      return between11To20Images;
    else return lessThan10Images;
  };

  const workFieldBannerImage = (workField: string) => {
    const assets = {
      laptop: 'DEVELOPMENT',
      loudspeaker: 'MARKETING',
      briefcase: 'LEGAL',
      brush: 'DESIGN',
      handshake: 'HR',
      book: 'EDUCATIONAL',
      spanner: 'MANUFACTURING',
      cardbox: 'OTHERS',
    };
    return PeopleCountImages()[assets[workField] || assets.cardbox];
  };

  return (
    <Styles.OnboardingTeamImageBannerWrapper
      isMobile={isMobile}
      BackgroundImage={workFieldBannerImage(teamState.workField.fieldName)}
    >
      <div />
    </Styles.OnboardingTeamImageBannerWrapper>
  );
};

OnboardingTeamCreationSetWorkFieldBanner.displayName =
  'OnboardingTeamCreationSetWorkFieldBanner';

export default OnboardingTeamCreationSetWorkFieldBanner;

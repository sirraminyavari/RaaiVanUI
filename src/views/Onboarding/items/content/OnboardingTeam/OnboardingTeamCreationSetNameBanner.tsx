// import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import OnboardingTeamCreationSetNameBannerImage from 'assets/images/onboarding-team-creation-set-name.svg?file';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const OnboardingTeamCreationSetNameBanner = () => {
  const { isMobile } = DimensionHelper();
  return (
    <>
      <Styles.OnboardingTeamImageBannerWrapper isMobile={isMobile}>
        <div>
          <Styles.OnboardingTeamAvatarPlaceholder
            backgroundImageURL={OnboardingTeamCreationSetNameBannerImage}
          />
        </div>
      </Styles.OnboardingTeamImageBannerWrapper>
    </>
  );
};

OnboardingTeamCreationSetNameBanner.displayName =
  'OnboardingTeamCreationSetNameBanner';

export default OnboardingTeamCreationSetNameBanner;

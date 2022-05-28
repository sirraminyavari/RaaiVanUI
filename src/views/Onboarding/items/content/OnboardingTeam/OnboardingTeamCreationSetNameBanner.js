// import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import OnboardingTeamCreationSetNameBannerImage from 'assets/images/onboarding-team-creation-set-name.svg?file';
// import { useOnboardingTeamContent } from 'views/Onboarding/items/others/OnboardingTeam.context';

const OnboardingTeamCreationSetNameBanner = ({ sticky }) => {
  // const { RVDic } = useWindow();
  // const { teamState } = useOnboardingTeamContent();

  // ! RVDic i18n localization
  // const RVDicِTeamAvatarPlaceholder = RVDic.ClickToUploadTheTeamLogo;

  return (
    <>
      <Styles.OnboardingTeamImageBannerWrapper>
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

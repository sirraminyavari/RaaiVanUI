// import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import { useOnboardingTeamContent } from 'views/Onboarding/items/others/OnboardingTeam.context';

const OnboardingTeamCreationSetNameBanner = () => {
  // const { RVDic } = useWindow();
  const { teamState } = useOnboardingTeamContent();

  // ! RVDic i18n localization
  // const RVDicِTeamAvatarPlaceholder = `برای آپلود لوگوی تیم اینجا کلیک کنید`;

  return (
    <>
      <Styles.OnboardingTeamImageBannerWrapper>
        <div>
          <Styles.OnboardingTeamAvatarPlaceholder>
            {teamState.teamName}
          </Styles.OnboardingTeamAvatarPlaceholder>
        </div>
      </Styles.OnboardingTeamImageBannerWrapper>
    </>
  );
};

OnboardingTeamCreationSetNameBanner.displayName =
  'OnboardingTeamCreationSetNameBanner';

export default OnboardingTeamCreationSetNameBanner;

import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import ImageCropper from 'components/ImageCropper/ImageCropper';
import { useOnboardingTeamContent } from 'views/Onboarding/items/others/OnboardingTeam.context';

const OnboardingTeamCreationSetNameBanner = () => {
  const { RVDic } = useWindow();
  const { teamState } = useOnboardingTeamContent();

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicِTeamAvatarPlaceholder = `برای آپلود لوگوی تیم اینجا کلیک کنید`;

  const goContinueTeamCreation = () => {};

  return (
    <>
      <Styles.OnboardingTeamImageBannerWrapper>
        <div>
          <ImageCropper
            image={
              'https://rvtest.s3.ir-thr-at1.arvanstorage.com/ProfileImages/99/3/993a5441-6be7-4fa5-88b5-19bf1ba81195.jpg'
            }
            uploadType="TeamImage"
            cropShape="round"
            uploadId={'1321'}
            onImageUpload={() => {}}
            showGrid={false}
            isEditable
          />
          <Styles.OnboardingTeamAvatarPlaceholder>
            {teamState.teamName || RVDicِTeamAvatarPlaceholder}
          </Styles.OnboardingTeamAvatarPlaceholder>
        </div>
      </Styles.OnboardingTeamImageBannerWrapper>
    </>
  );
};

OnboardingTeamCreationSetNameBanner.displayName =
  'OnboardingTeamCreationSetNameBanner';

export default OnboardingTeamCreationSetNameBanner;

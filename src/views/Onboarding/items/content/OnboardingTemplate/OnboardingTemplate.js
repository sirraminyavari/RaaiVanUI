import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplate.styles';
import VideoPlayer from 'views/Onboarding/items/others/VideoPlayer/VideoPlayer';
import Button from 'components/Buttons/Button';

const OnboardingTemplateContent = () => {
  const { RVDic } = useWindow();
  const history = useHistory();

  const videoSrcList = [
    {
      src: 'https://static.videezy.com/system/resources/previews/000/041/206/original/12.Audio_Visualizer.mp4',
      type: 'video/mp4',
    },
  ];

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicOnboardingTemplateTitle = 'تمپلیت چیست؟';
  const RVDicOnboardingTemplateUnderstood = 'متوجه شدم !';
  const RVDicOnboardingTemplateDescription =
    'در هر کاری داشتن یک تمپلیت یا الگو، کار را ساده‌تر می‌کند؛ یکی از قابلیت‌های مهم کلیک‌مایند تمپلیت‌ها هستند. هر مفهومی که در تیم یا کسب‌وکار شما با اهمیت است یا درمورد آن اطلاعات به دردبخور دارید می‌تواند یک تمپلیت اختصاصی داشته باشد؛ به طور مثال مکاتبات، گزارش‌ها، پروژه‌ها، رقبا، تجهیزات، محصولات و سایر موارد مشابه.';
  return (
    <Styles.OnboardingTemplateWrapper>
      <Styles.OnboardingTemplateVideoContainer>
        <VideoPlayer videoSrcList={videoSrcList} />
      </Styles.OnboardingTemplateVideoContainer>
      <Styles.OnboardingTemplateTitle type="H1">
        {RVDicOnboardingTemplateTitle}
      </Styles.OnboardingTemplateTitle>
      <Styles.RVDicOnboardingTemplateDescription type="H3">
        {RVDicOnboardingTemplateDescription}
      </Styles.RVDicOnboardingTemplateDescription>

      <Button style={{ paddingInline: '4rem' }}>
        {RVDicOnboardingTemplateUnderstood}
      </Button>
    </Styles.OnboardingTemplateWrapper>
  );
};

OnboardingTemplateContent.displayName = 'OnboardingTemplateContent';

export default OnboardingTemplateContent;

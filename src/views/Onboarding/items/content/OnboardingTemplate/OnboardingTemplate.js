import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplate.styles';
import VideoPlayer from 'views/Onboarding/items/others/VideoPlayer/VideoPlayer';
import Button from 'components/Buttons/Button';
import { ONBOARDING_TEMPLATE_SELECTION_PATH } from 'views/Onboarding/items/others/constants';
import { decodeBase64 } from 'helpers/helpers';

const OnboardingTemplateContent = () => {
  const { RVDic, RVGlobal } = useWindow();
  const history = useHistory();

  const goToTemplateSelectionView = () =>
    history.push(ONBOARDING_TEMPLATE_SELECTION_PATH);

  const videoSrcList = [
    {
      src: 'https://static.videezy.com/system/resources/previews/000/041/206/original/12.Audio_Visualizer.mp4',
      type: 'video/mp4',
    },
  ];

  //! RVDic i18n localization
  const RVDicOnboardingTemplateTitle = RVDic.WhatIsN.replace(
    '[n]',
    RVDic.Template
  );
  const RVDicOnboardingTemplateUnderstood = RVDic.GotIt;
  const RVDicOnboardingTemplateDescription = RVDic._HelpTemplate.replace(
    '[RaaiVan]',
    decodeBase64(RVGlobal.SystemName)
  );

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

      <Button
        style={{ paddingInline: '4rem' }}
        onClick={goToTemplateSelectionView}
      >
        {RVDicOnboardingTemplateUnderstood}
      </Button>
    </Styles.OnboardingTemplateWrapper>
  );
};

OnboardingTemplateContent.displayName = 'OnboardingTemplateContent';

export default OnboardingTemplateContent;

import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import OnboardingTemplateSelectionGallery from './OnboardingTemplateSelectionGallery';
import OnboardingTemplateSelectionCurrentTemplate from './OnboardingTemplateSelectionCurrentTemplate';
import OnboardingTemplateSelectionNode from './OnboardingTemplateSelectionNode';
import OnboardingTemplateSelectionCarousel from './OnboardingTemplateSelectionCarousel';
import Button from 'components/Buttons/Button';

const OnboardingTemplateSelectionContent = () => {
  const { RVDic } = useWindow();
  const history = useHistory();

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicSaveAndNext = RVDic.SaveAndNext;
  const RVDicUseDefaultTemplates = `!از تمپلیت‌های پیش‌فرض استفاده کن`;
  return (
    <Styles.OnboardingTemplateSelectionWrapper>
      <OnboardingTemplateSelectionGallery />
      <div>
        <Styles.OnboardingTemplateSelectionTemplatePanel>
          <OnboardingTemplateSelectionCurrentTemplate />
          <OnboardingTemplateSelectionNode />
        </Styles.OnboardingTemplateSelectionTemplatePanel>
        <OnboardingTemplateSelectionCarousel />
        <Styles.OnboardingTemplateSelectionButtonWrapper>
          <Button style={{ paddingInline: '3rem' }} disable>
            {RVDicSaveAndNext}
          </Button>
          <Button style={{ paddingInline: '1rem' }} type="primary-o">
            {RVDicUseDefaultTemplates}
          </Button>
        </Styles.OnboardingTemplateSelectionButtonWrapper>
      </div>
    </Styles.OnboardingTemplateSelectionWrapper>
  );
};

OnboardingTemplateSelectionContent.displayName =
  'OnboardingTemplateSelectionContent';

export default OnboardingTemplateSelectionContent;

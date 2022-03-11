import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import { useEffect, useState } from 'react';
import { getTemplates } from 'apiHelper/ApiHandlers/CNApi';
import { parseTemplates } from 'components/TemplatesGallery/templateUtils.js';
import OnboardingTemplateSelectionGalleryItem from './OnboardingTemplateSelectionGalleryItem';

// TODO extract Dropdown as a dedicated component
const OnboardingTemplateSelectionGallery = () => {
  const [templates, setTemplates] = useState([]);
  const [activeTemplateID, setActiveTemplateID] = useState();
  const { RVDic } = useWindow();

  useEffect(() => {
    getTemplates().then((res) => {
      const parsedTemplates = parseTemplates(res);
      setTemplates(parsedTemplates);
      console.log({ res, parsedTemplates });
    });
  }, []);

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicOnboardingTemplateGallery = 'گالری تمپلیت‌ها';
  const RVDicOnboardingTemplateSuggestionGallery = 'پیشنهاد کلیک‌مایند';

  return (
    <>
      <Styles.OnboardingTemplateSelectionGalleryContainer>
        <Styles.OnboardingTemplateSelectionGalleryTitle>
          {RVDicOnboardingTemplateGallery}
        </Styles.OnboardingTemplateSelectionGalleryTitle>
        <Styles.OnboardingTemplateSelectionGallerySuggestion>
          {RVDicOnboardingTemplateSuggestionGallery}
        </Styles.OnboardingTemplateSelectionGallerySuggestion>
        {templates?.Tags?.map(({ Name, NodeID, NodeTypeID, Templates }) => {
          return (
            <OnboardingTemplateSelectionGalleryItem
              Name={Name}
              Templates={Templates}
              key={NodeID}
            />
          );
        })}
      </Styles.OnboardingTemplateSelectionGalleryContainer>
    </>
  );
};

OnboardingTemplateSelectionGallery.displayName =
  'OnboardingTemplateSelectionGallery';

export default OnboardingTemplateSelectionGallery;

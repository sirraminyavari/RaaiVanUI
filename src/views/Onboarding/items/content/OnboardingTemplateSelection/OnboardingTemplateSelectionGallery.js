import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import OnboardingTemplateSelectionGalleryItem from './OnboardingTemplateSelectionGalleryItem';

// TODO extract Dropdown as a dedicated component
const OnboardingTemplateSelectionGallery = ({
  templates,
  setActiveTag,
  activateTemplate,
}) => {
  const { RVDic } = useWindow();

  console.log({
    templates,
    setActiveTag,
    activateTemplate,
  });

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
        <Styles.OnboardingTemplateSelectionGallerySuggestion
          onClick={() => setActiveTag(undefined)}
        >
          {RVDicOnboardingTemplateSuggestionGallery}
        </Styles.OnboardingTemplateSelectionGallerySuggestion>
        {templates?.Tags?.map((Tag, idx) => {
          const { Name, NodeID, NodeTypeID, Templates } = Tag;
          alert('Name');
          return (
            <OnboardingTemplateSelectionGalleryItem
              Name={Name}
              Templates={Templates}
              key={NodeID}
              onClick={() => setActiveTag(Tag)}
              activateTemplate={activateTemplate}
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

import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import OnboardingTemplateSelectionGalleryItem from './OnboardingTemplateSelectionGalleryItem';

// TODO extract Dropdown as a dedicated component
const OnboardingTemplateSelectionGallery = ({
  templates,
  setActiveTag,
  activateTemplate,
}) => {
  const { RVDic, RVGlobal } = useWindow();

  console.log({
    templates,
    setActiveTag,
    activateTemplate,
  });

  //! RVDic i18n localization
  const RVDicOnboardingTemplateGallery = RVDic.TemplatesGallery;
  const RVDicOnboardingTemplateSuggestionGallery =
    RVDic.SuggestedByRaaiVan.replace(
      '[RaaiVan]',
      decodeBase64(RVGlobal.SystemName)
    );
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
          const { Name, NodeID, Templates } = Tag;
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

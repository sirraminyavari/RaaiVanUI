import { decodeBase64 } from 'helpers/helpers';
import HamburgerMenuIcon from 'components/Icons/MenuIcon/HamburgerMenuIcon';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import OnboardingTemplateSelectionGalleryItem from './OnboardingTemplateSelectionGalleryItem';
import { useState } from 'react';

// TODO extract Dropdown as a dedicated component
const OnboardingTemplateSelectionGallery = ({
  templates,
  setActiveTag,
  activateTemplate,
  mobile,
}) => {
  const { RVDic, RVGlobal } = useWindow();
  const [isCollapsed, setIsCollapsed] = useState(true);

  //! RVDic i18n localization
  const RVDicOnboardingTemplateGallery = RVDic.TemplatesGallery;
  const RVDicOnboardingTemplateSuggestionGallery =
    RVDic.SuggestedByRaaiVan.replace(
      '[RaaiVan]',
      decodeBase64(RVGlobal.SystemName)
    );

  return (
    <Styles.OnboardingTemplateSelectionGalleryContainer mobile={mobile}>
      <Styles.OnboardingTemplateSelectionGalleryContainerBackground>
        <Styles.OnboardingTemplateSelectionGalleryTitle>
          {mobile && (
            <>
              <Styles.OnboardingTemplateSelectionGalleryTitleMenuButton
                onClick={() => setIsCollapsed((state) => !state)}
              >
                <HamburgerMenuIcon />
              </Styles.OnboardingTemplateSelectionGalleryTitleMenuButton>
            </>
          )}
          {RVDicOnboardingTemplateGallery}
        </Styles.OnboardingTemplateSelectionGalleryTitle>
        <Styles.OnboardingTemplateSelectionGalleryContentWrapper
          isCollapsed={mobile && isCollapsed}
        >
          <Styles.OnboardingTemplateSelectionGallerySuggestion
            onClick={() => setActiveTag(undefined)}
          >
            {RVDicOnboardingTemplateSuggestionGallery}
          </Styles.OnboardingTemplateSelectionGallerySuggestion>
          {templates?.Tags?.map((Tag, idx) => {
            const { Name, NodeID, Templates } = Tag;
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
        </Styles.OnboardingTemplateSelectionGalleryContentWrapper>
      </Styles.OnboardingTemplateSelectionGalleryContainerBackground>
    </Styles.OnboardingTemplateSelectionGalleryContainer>
  );
};

OnboardingTemplateSelectionGallery.displayName =
  'OnboardingTemplateSelectionGallery';

export default OnboardingTemplateSelectionGallery;

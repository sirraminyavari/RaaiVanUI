import { decodeBase64 } from 'helpers/helpers';
import HamburgerMenuIcon from 'components/Icons/MenuIcon/HamburgerMenuIcon';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import OnboardingTemplateSelectionGalleryItem from './OnboardingTemplateSelectionGalleryItem';
import { useState } from 'react';
import { BO_RADIUS_HALF } from 'constant/constants';
import OnboardingTemplateSelectionGalleryItemSkeleton from './OnboardingTemplateSelectionGalleryItemSkeleton';

// TODO extract Dropdown as a dedicated component
const OnboardingTemplateSelectionGallery = ({
  templates,
  setActiveTag,
  activateTemplate,
  mobile,
}) => {
  const { RVDic, RVGlobal } = useWindow();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeID, setActiveID] = useState();

  //! RVDic i18n localization
  const RVDicOnboardingTemplateGallery = RVDic.TemplatesGallery;
  const RVDicOnboardingTemplateSuggestionGallery =
    RVDic.SuggestedByRaaiVan.replace(
      '[RaaiVan]',
      decodeBase64(RVGlobal.SystemName)
    );

  return (
    <Styles.OnboardingTemplateSelectionGalleryContainer mobile={mobile}>
      <Styles.OnboardingTemplateSelectionGalleryContainerBackground
        className={mobile && BO_RADIUS_HALF}
        mobile={mobile}
      >
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
          <span>{RVDicOnboardingTemplateGallery}</span>
        </Styles.OnboardingTemplateSelectionGalleryTitle>
        <Styles.OnboardingTemplateSelectionGalleryContentWrapper
          isCollapsed={isCollapsed}
          mobile={mobile}
        >
          {templates?.Tags ? (
            <>
              <Styles.OnboardingTemplateSelectionGallerySuggestion
                onClick={() => {
                  setActiveTag(undefined);
                  setActiveID(undefined);
                }}
                active={activeID === undefined}
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
                    onClick={() => {
                      setActiveTag(Tag);
                      setActiveID(NodeID);
                    }}
                    active={activeID === NodeID}
                    activateTemplate={activateTemplate}
                  />
                );
              })}
            </>
          ) : (
            <OnboardingTemplateSelectionGalleryItemSkeleton />
          )}
        </Styles.OnboardingTemplateSelectionGalleryContentWrapper>
      </Styles.OnboardingTemplateSelectionGalleryContainerBackground>
    </Styles.OnboardingTemplateSelectionGalleryContainer>
  );
};

OnboardingTemplateSelectionGallery.displayName =
  'OnboardingTemplateSelectionGallery';

export default OnboardingTemplateSelectionGallery;

import styled from 'styled-components';
import Heading from 'components/Heading/Heading';
import {
  CV_GRAY_DARK,
  CV_GRAY,
  TCV_WARM,
  CV_DISTANT,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import { BO_RADIUS_HALF } from 'constant/constants';
import { FLEX_RSS, FLEX_RCS, FLEX_RCC } from 'constant/StyledCommonCss';

export const OnboardingTemplateSelectionWrapper = styled.div`
  padding-block-end: 2rem;
  ${FLEX_RSS}
  &>div:last-of-type {
    padding: 0.5rem 2rem;
    width: calc(100% - 17.5rem);
  }
`;
OnboardingTemplateSelectionWrapper.displayName =
  'OnboardingTemplateSelectionWrapper';

export const OnboardingTemplateSelectionTemplatePanel = styled.div`
  ${FLEX_RSS}
  align-items: stretch;

  & > div {
    width: 100%;
  }
`;
OnboardingTemplateSelectionTemplatePanel.displayName =
  'OnboardingTemplateSelectionTemplatePanel';

export const OnboardingTemplateSelectionButtonWrapper = styled.div`
  margin-block-start: 2.2rem;
  width: 100%;
  margin-inline: auto;
  display: flex;
  // flex-wrap: wrap;
  flex-shrink: 0;

  & > * {
    margin-inline: 1rem;
  }
`;
OnboardingTemplateSelectionButtonWrapper.displayName =
  'OnboardingTemplateSelectionButtonWrapper';

export const OnboardingTemplateSelectionCurrentTemplateTitle = styled(
  Heading
).attrs({ type: 'H1' })`
  color: ${CV_GRAY_DARK};
  max-width: 60rem;
`;
OnboardingTemplateSelectionCurrentTemplateTitle.displayName =
  'OnboardingTemplateSelectionCurrentTemplateTitle';

export const OnboardingTemplateSelectionImage = styled.img`
  max-width: 4rem;
  width: 80%;
  margin-block-end: 1rem;
`;
OnboardingTemplateSelectionCurrentTemplateTitle.displayName =
  'OnboardingTemplateSelectionCurrentTemplateTitle';

export const OnboardingTemplateSelectionCurrentTemplateParagraph = styled.p`
  margin-block: 1rem;
  color: ${CV_GRAY};
`;
OnboardingTemplateSelectionCurrentTemplateParagraph.displayName =
  'OnboardingTemplateSelectionCurrentTemplateParagraph';

export const RVDicOnboardingTemplateDescription = styled(Heading).attrs({
  type: 'H6',
})`
  color: ${CV_GRAY};
  max-width: 60rem;
  text-align: center;
  margin-block-end: 2.5rem;
`;
RVDicOnboardingTemplateDescription.displayName =
  'RVDicOnboardingTemplateDescription';

export const OnboardingTemplateSelectionCarouselNavigationButton = styled.div.attrs(
  {
    className: BO_RADIUS_HALF,
  }
)`
  position: absolute;
  inset-block: calc(50% - 1rem);
  width: 2.5rem;
  height: 2.5rem;
  z-index: 100;
  background-color: ${CV_GRAY};
  color: ${CV_WHITE};
  font-size: 1rem;
  opacity: 0.4;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.25s, opacity 0.25s, color 0.25s;
  ${FLEX_RCC}

  ${({ dir }) => (dir === 'left' ? `left: 0rem;` : `right: 0rem;`)}

  &:hover {
    background-color: ${CV_WHITE};
    color: ${CV_GRAY};
    opacity: 1;
  }
`;
OnboardingTemplateSelectionCarouselNavigationButton.displayName =
  'OnboardingTemplateSelectionCarouselNavigationButton';

export const OnboardingTemplateSelectionCarouselContainer = styled.div`
  width: 100%;
  position: relative;
  ${FLEX_RCS}

  &:not(:hover) {
    ${OnboardingTemplateSelectionCarouselNavigationButton} {
      opacity: 0 !important;
    }
  }
`;
OnboardingTemplateSelectionCarouselContainer.displayName =
  'OnboardingTemplateSelectionCarouselContainer';

export const OnboardingTemplateSelectionCarouselInnerContainer = styled.div`
  width: 100%;
  margin-block-start: 2rem;
  padding-block: 0.7rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  ${FLEX_RCS}
`;
OnboardingTemplateSelectionCarouselInnerContainer.displayName =
  'OnboardingTemplateSelectionCarouselInnerContainer';

export const OnboardingTemplateSelectionGalleryContainer = styled.div`
  width: 17.5rem;
  background-color: #2b7be40d;
  font-size: 1rem;
  padding-block: 0.7rem;
  flex-shrink: 0;
  //TODO change color to color-constant
`;
OnboardingTemplateSelectionGalleryContainer.displayName =
  'OnboardingTemplateSelectionGalleryContainer';

export const OnboardingTemplateSelectionGalleryTitle = styled.div`
  color: ${CV_DISTANT};
  padding-inline: 1.4rem;
  padding-block: 0.7rem;
`;
OnboardingTemplateSelectionGalleryTitle.displayName =
  'OnboardingTemplateSelectionGalleryTitle';

export const OnboardingTemplateSelectionGallerySuggestion = styled.div.attrs({
  className: BO_RADIUS_HALF,
})`
  color: ${TCV_WARM};
  padding: 0.7rem;
  margin: 0.7rem;
  background-color: ${CV_WHITE};
`;
OnboardingTemplateSelectionGallerySuggestion.displayName =
  'OnboardingTemplateSelectionGallerySuggestion';

export const OnboardingTemplateSelectionGalleryItemSummery = styled.summary.attrs(
  {
    className: BO_RADIUS_HALF,
  }
)`
  ${({ isOpen }) => (isOpen ? `color: ${TCV_DEFAULT};` : `color: ${CV_GRAY};`)}
  padding: 0.7rem;
  margin-inline: 0.7rem;
  margin-block: 0.4rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s;
  & > svg {
    transition: transform 0.3s, color 0.3s;
    ${({ isOpen }) =>
      isOpen
        ? `transform: rotate(-90deg);color: ${TCV_DEFAULT};`
        : `color: ${CV_DISTANT};`}
    margin-inline-end: 0.7rem;
  }
`;
OnboardingTemplateSelectionGalleryItemSummery.displayName =
  'OnboardingTemplateSelectionGalleryItemSummery';

export const OnboardingTemplateSelectionGalleryItemSubItem = styled.div`
  color: ${CV_GRAY};
  // padding: 0.7rem;
  margin-inline-start: 2.4rem;
  margin-block: 0.7rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  & > img {
    height: 2rem;
    margin-inline-end: 0.7rem;
  }
`;
OnboardingTemplateSelectionGalleryItemSubItem.displayName =
  'OnboardingTemplateSelectionGalleryItemSubItem';

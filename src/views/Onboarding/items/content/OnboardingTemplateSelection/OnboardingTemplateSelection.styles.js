import styled from 'styled-components';
import Heading from 'components/Heading/Heading';
import Button from 'components/Buttons/Button';
import {
  CV_GRAY_DARK,
  CV_GRAY,
  TCV_WARM,
  CV_DISTANT,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';
import { BO_RADIUS_HALF } from 'constant/constants';
import {
  FLEX_RSS,
  FLEX_RCS,
  FLEX_RCC,
  FLEX_CSC,
} from 'constant/StyledCommonCss';

export const OnboardingTemplateSelectionWrapper = styled.div`
  padding-block-end: 2rem;
  ${({ mobile }) => !mobile && FLEX_RSS}
  position: relative;

  & > div:last-of-type {
    padding: 0.5rem 2rem;
    ${({ mobile }) => (mobile ? 'width:100%;' : 'width:calc(100% - 17.5rem);')}
  }
`;
OnboardingTemplateSelectionWrapper.displayName =
  'OnboardingTemplateSelectionWrapper';

export const OnboardingTemplateSelectionTemplatePanel = styled.div`
  ${({ mobile }) => (mobile ? FLEX_CSC : FLEX_RSS)}
  align-items: stretch;
  gap: 1rem;

  & > div {
    width: 100%;
    min-width: 40%;
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
  align-items: center;
  & > * {
    margin-inline: 1rem;
  }
`;
OnboardingTemplateSelectionButtonWrapper.displayName =
  'OnboardingTemplateSelectionButtonWrapper';

export const OnboardingTemplateSelectionTemplateCount = styled.div`
  padding-inline: 2.2rem;
  font-size: 0.8rem;
  height: 100%;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  color: ${CV_DISTANT};
  cursor: pointer;

  &::first-letter {
    text-transform: capitalize;
  }
`;
OnboardingTemplateSelectionButtonWrapper.displayName =
  'OnboardingTemplateSelectionButtonWrapper';

export const OnboardingTemplateSelectionCurrentTemplateContainer = styled.div`
  min-height: ;50vh;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`;
OnboardingTemplateSelectionCurrentTemplateContainer.displayName =
  'OnboardingTemplateSelectionCurrentTemplateContainer';

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
  font-size: 1rem;
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
  ${({ mobile }) => !mobile && 'width: 17.5rem;'}
  position:sticky;
  z-index: 1;
  top: 3.5rem;
  ${({ mobile }) =>
    mobile &&
    `
  top: 3rem;
  `}
  background-color: ${CV_WHITE};
  font-size: 1rem;
  padding-block: 0.7rem;
  flex-shrink: 0;
`;
OnboardingTemplateSelectionGalleryContainer.displayName =
  'OnboardingTemplateSelectionGalleryContainer';

export const OnboardingTemplateSelectionGalleryContainerBackground = styled.div`
  // background-color: #2b7be40d;
  background-color: ${TCV_VERY_TRANSPARENT};
  display: grid;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
  ${({ isCollapsed, mobile }) =>
    mobile && isCollapsed
      ? `
  overflow-y: hidden;
  height: 0;
  
  `
      : `
  height: 100%;   
  ${mobile && `max-height: calc(100vh - 10rem);`}
  `}
`;
OnboardingTemplateSelectionGalleryContainerBackground.displayName =
  'OnboardingTemplateSelectionGalleryContainerBackground';

export const OnboardingTemplateSelectionGalleryContentWrapper = styled.div`
  // transition: height 0.25s, max-height 0.25s;
  ${({ isCollapsed, mobile }) =>
    mobile && isCollapsed
      ? `
  overflow-y: hidden;
  height: 0;
  
  `
      : `
  height: 100%;   
  ${mobile && `max-height: calc(100vh - 10rem);`}
  overflow-y: auto;
  `}
`;
OnboardingTemplateSelectionGalleryContentWrapper.displayName =
  'OnboardingTemplateSelectionGalleryContentWrapper';

export const OnboardingTemplateSelectionGalleryTitle = styled.div`
  color: ${CV_DISTANT};
  padding-inline: 1.4rem;
  padding-block: 0.7rem;
  ${FLEX_RCS}

  &::first-letter {
    text-transform: capitalize;
  }
`;
OnboardingTemplateSelectionGalleryTitle.displayName =
  'OnboardingTemplateSelectionGalleryTitle';

export const OnboardingTemplateSelectionGalleryTitleMenuButton = styled(Button)`
  margin-inline: 0.5rem;
  font-size: 1.2rem;
`;
OnboardingTemplateSelectionGalleryTitleMenuButton.displayName =
  'OnboardingTemplateSelectionGalleryTitleMenuButton';

export const OnboardingTemplateSelectionGallerySuggestion = styled.div.attrs({
  className: BO_RADIUS_HALF,
})`
  color: ${TCV_WARM};
  padding: 0.7rem;
  margin: 0.7rem;
  ${({ active }) => active && `background-color: ${CV_WHITE};`}
  cursor: pointer;
`;
OnboardingTemplateSelectionGallerySuggestion.displayName =
  'OnboardingTemplateSelectionGallerySuggestion';

export const OnboardingTemplateSelectionGalleryItemDetails = styled.details.attrs(
  {
    className: BO_RADIUS_HALF,
  }
)`
  ${({ active }) => active && `background-color: ${CV_WHITE};`}
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
OnboardingTemplateSelectionGalleryItemDetails.displayName =
  'OnboardingTemplateSelectionGalleryItemDetails';

export const OnboardingTemplateSelectionGalleryItemSummery = styled.summary.attrs(
  {
    className: BO_RADIUS_HALF,
  }
)`
  ${({ isOpen }) => (isOpen ? `color: ${TCV_DEFAULT};` : `color: ${CV_GRAY};`)}
  ${({ active }) => active && `background-color: ${CV_WHITE};`}
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

export const OnboardingTemplateSelectionNodeContainer = styled.div`
  width: 100% !important;
  border: 1px solid ${CV_DISTANT};
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 0.8rem;
  position: relative;
  padding-inline: 2.5rem;
  padding-block: 1rem;
  margin-block-start: 1rem;
  max-height: clamp(30rem, 100%, 80vh);
  position: sticky;
  top: 5rem;

  & > div::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 110%;
    z-index: 1;
  }

  & > div {
    // height: clamp(10rem, 40vh, 70vh);
    position: relative;
  }
`;
OnboardingTemplateSelectionNodeContainer.displayName =
  'OnboardingTemplateSelectionNodeContainer';

export const OnboardingTemplateSelectionSelectedModalContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.2rem;
  margin-block-start: 1rem;
`;
OnboardingTemplateSelectionSelectedModalContainer.displayName =
  'OnboardingTemplateSelectionSelectedModalContainer';

export const OnboardingTemplateSelectionSelectedModalTemplateWrapper = styled.div`
  margin-block: 0.5rem;
  display: flex;
  justify-content: space-between;
`;
OnboardingTemplateSelectionSelectedModalTemplateWrapper.displayName =
  'OnboardingTemplateSelectionSelectedModalTemplateWrapper';

export const OnboardingTemplateSelectionSelectedModalTemplateTitleWrapper = styled.div`
  & > img {
    width: 3rem;
    margin-inline-end: 0.5rem;
  }
`;
OnboardingTemplateSelectionSelectedModalTemplateTitleWrapper.displayName =
  'OnboardingTemplateSelectionSelectedModalTemplateTitleWrapper';

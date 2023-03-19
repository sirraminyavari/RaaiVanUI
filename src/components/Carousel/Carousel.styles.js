import styled from 'styled-components';
import { BO_RADIUS_HALF } from 'constant/constants';
import { CV_GRAY, CV_WHITE } from 'constant/CssVariables';
import { FLEX_RCC, FLEX_RCS } from 'constant/StyledCommonCss';

export const CarouselNavigationButton = styled.div.attrs({
  className: BO_RADIUS_HALF,
})`
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
CarouselNavigationButton.displayName = 'CarouselNavigationButton';

export const CarouselContainer = styled.div`
  width: 100%;
  position: relative;
  ${FLEX_RCS}

  &:not(:hover) {
    ${CarouselNavigationButton} {
      opacity: 0 !important;
    }
  }
`;
CarouselContainer.displayName = 'CarouselContainer';

export const CarouselInnerContainer = styled.div`
  width: 100%;
  margin-block: 0.7rem;
  padding-block: 0.7rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  ${FLEX_RCS}
`;
CarouselInnerContainer.displayName = 'CarouselInnerContainer';

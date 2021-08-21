import {
  BG_GRAY_LIGHT,
  BO_DISTANT,
  C_DISTANT,
  C_GRAY_DARK,
} from 'constant/Colors';
import { BO_RADIUS_HALF, IGNORE_RADIUS_LEFT } from 'constant/constants';
import { CV_BLACK } from 'constant/CssVariables';
import { FLEX_RCB } from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const TemplateGalleryContainer = styled.div`
  .templates-modal-title-container {
    display: none;
  }
`;

export const ModalContentWrapper = styled.div`
  ${FLEX_RCB}
  color: ${CV_BLACK};
  margin: -1rem;
  height: calc(100vh - 5rem);
`;

export const GalleryListContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_HALF} ${IGNORE_RADIUS_LEFT}`,
})`
  width: 25%;
  padding: 1rem;
  height: 100%;
`;

export const GalleryMainContainer = styled.div`
  width: 75%;
  height: 100%;
  padding: 0.7rem;

  .swiper-container {
    width: 100%;
    height: 100%;
  }
`;

export const ModalTitle = styled.div.attrs({
  className: `${C_DISTANT}`,
})`
  font-size: 1rem;
  font-weight: 500;
`;

export const SuggestionListTitle = styled.div.attrs({
  className: `${C_GRAY_DARK}`,
})`
  font-size: 1rem;
  font-weight: 500;
  margin: 1rem 0;
`;

export const TemplateCardContainer = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_HALF}`,
})`
  width: 99%;
  height: 8.5rem;
`;

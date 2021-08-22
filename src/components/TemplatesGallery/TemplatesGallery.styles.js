import {
  BG_GRAY_LIGHT,
  BO_DISTANT,
  C_DISTANT,
  C_GRAY_DARK,
  TC_DEFAULT,
} from 'constant/Colors';
import { BO_RADIUS_HALF, IGNORE_RADIUS_LEFT } from 'constant/constants';
import {
  CV_BLACK,
  CV_GRAY,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';
import { FLEX_RCB, FLEX_RSB } from 'constant/StyledCommonCss';
import styled from 'styled-components';

const { RV_RevFloat, GlobalUtilities } = window;

export const TemplateGalleryContainer = styled.div`
  user-select: none;
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
  position: relative;
`;

export const AddTemplateButtonWrapper = styled.div`
  position: relative;

  .add-template-icon {
    position: absolute;
    top: 1.5rem;
    right: 1rem;
    z-index: ${GlobalUtilities.zindex.alert()};
  }
`;

export const GalleryInfosContainer = styled.div`
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
  font-size: 0.9rem;
  font-weight: 500;
  margin: 1rem 0;
`;

export const TemplateCardContainer = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_HALF}`,
})`
  width: 89%;
  height: 7.5rem;
  padding: 0.7rem;
  position: relative;

  .template-card-badge {
    position: absolute;
    ${RV_RevFloat}: 0.7rem;
    font-size: 0.85rem;
    padding: 0 0.5rem;
    border-radius: 1rem;
    background-color: ${TCV_VERY_TRANSPARENT};
    width: 8rem;
    color: ${TCV_DEFAULT};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const TemplateCardTitle = styled.div`
  margin: 0.5rem 0;
`;

export const TemplateCardExcerpt = styled.div`
  font-size: 0.8rem;
  color: ${CV_GRAY};
  text-align: justify;
  text-justify: inter-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MainContentInfoWrapper = styled.div`
  width: 80%;
`;

export const MainContentTitle = styled.div.attrs({
  className: `${TC_DEFAULT}`,
})`
  font-size: 1.2rem;
  font-weight: 500;
  margin-top: 2.5rem;
`;

export const MainContentExcerpt = styled.div.attrs({
  className: `${C_GRAY_DARK}`,
})`
  font-size: 1rem;
  margin: 0.5rem 0;
`;

export const MainContentDescription = styled.div.attrs({
  className: `${C_DISTANT}`,
})`
  font-size: 0.9rem;
  margin: 0.5rem 0;
  text-align: justify;
  text-justify: inter-word;
`;

export const MainContentInputWrapper = styled.div`
  position: relative;

  :focus-within svg {
    color: ${TCV_DEFAULT} !important;
  }

  .gallery-input-icon {
    position: absolute;
    ${RV_RevFloat}: 0.5rem;
    top: 0.5rem;
  }
`;

export const MainContentInfoSection = styled.div`
  ${FLEX_RSB}
  height: 20rem;
`;

export const MainSwiperTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

export const MainContentSwiperSection = styled.div.attrs({
  className: `${TC_DEFAULT}`,
})`
  position: relative;
  bottom: 2rem;
`;

export const MainContentImageWrapper = styled.div`
  padding: 3rem;
  width: 30rem;

  img {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
  }
`;

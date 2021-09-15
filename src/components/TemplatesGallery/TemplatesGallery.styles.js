import {
  BG_GRAY_LIGHT,
  BO_DISTANT,
  C_DISTANT,
  C_GRAY,
  C_GRAY_DARK,
  TC_DEFAULT,
} from 'constant/Colors';
import { BO_RADIUS_HALF, IGNORE_RADIUS_LEFT } from 'constant/constants';
import {
  CV_BLACK,
  CV_DISTANT,
  CV_GRAY,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
  TCV_WARM,
} from 'constant/CssVariables';
import {
  FLEX_CCC,
  FLEX_RCB,
  FLEX_RCS,
  FLEX_RSB,
} from 'constant/StyledCommonCss';
import styled, { css } from 'styled-components';

const { RV_RevFloat, GlobalUtilities, RV_Float } = window;

const commonScrollCss = css`
  .ps__thumb-y {
    background-color: ${CV_BLACK} !important;
  }
  .ps__rail-y:hover {
    background-color: transparent !important;
  }
  .ps__rail-y {
    ${RV_Float}: 0rem !important;
  }
`;

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
  bottom: -1rem;
  cursor: pointer;

  .add-template-icon {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    z-index: ${GlobalUtilities.zindex.alert()};
  }
  .add-template-button {
    background-color: ${CV_WHITE}};
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

  .template-description-scrollbar {
    max-height: 100%;
    ${commonScrollCss}
  }

  .template-category-scrollbar {
    ${commonScrollCss}
  }
`;

export const ModalTitle = styled.div.attrs({
  className: `${C_DISTANT}`,
})`
  font-size: 1rem;
  font-weight: 500;
`;

export const SuggestionListContainer = styled.div`
  .template-suggestion-list-scrollbar {
    height: calc(100vh - 15rem);
    margin-${RV_Float}: -1rem;
    padding-${RV_Float}: 1.3rem;
  }

  ${commonScrollCss}
`;

export const SuggestionListTitle = styled.div.attrs({
  className: `${C_GRAY_DARK}`,
})`
  font-size: 0.9rem;
  font-weight: 500;
  margin: 1rem 0;
  cursor: pointer;
`;

const getWidth = ({ mode }) => {
  switch (mode) {
    case 'grid':
      return 'width: 100%;';

    default:
      return 'width: 89%;';
  }
};

export const TemplateCardContainer = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_HALF}`,
})`
  ${getWidth}
  max-height: 9rem;
  padding: 0.7rem;
  position: relative;

  .template-card-badge {
    position: absolute;
    ${RV_RevFloat}: 0.7rem;
    font-size: 0.85rem;
    padding: 0 0.5rem;
    border-radius: 1rem;
    background-color: ${TCV_VERY_TRANSPARENT};
    width: auto;
    max-width: 8rem;
    color: ${TCV_DEFAULT};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ${FLEX_RCS}
  }
`;

export const TemplateCardTitle = styled.div.attrs({
  className: `${TC_DEFAULT}`,
})`
  margin: 0.5rem 0;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

  .swiper-scrollbar {
    bottom: 0rem !important;
  }
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

export const TemplateItemWrapper = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  width: ${({ indentStep }) => `calc(100% - ${indentStep}px)`};
  margin-${RV_Float}: ${({ indentStep }) => `${indentStep}px`};
  ${FLEX_RCS}
  padding: 0.3rem 0;
  cursor: pointer;
`;

export const TemplateIconWrapper = styled.span`
  color: ${({ isExpanded }) => (isExpanded ? TCV_DEFAULT : '')};
`;

export const TemplateItemTitle = styled.span`
  margin-${RV_Float}: 0.2rem;
  ${({ isSelected }) => isSelected && `color: ${TCV_DEFAULT};`}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CategoryContentContainer = styled.div`
  margin-top: 2.5rem;
  height: 100%;
`;
const commonTitleStyle = css`
  color: ${TCV_WARM};
  font-size: 1.2rem;
  font-weight: 500;
`;
export const CategoryTitle = styled.div`
  ${commonTitleStyle}
  margin:  0 1.5rem 2rem 0;
`;

export const CategoryDescription = styled.div`
  color: ${CV_DISTANT};
  // height: 7rem;
  font-size: 0.9rem;
  padding: 0 1.5rem;
  line-height: 1.5rem;
  text-align: justify;
  text-justify: inter-word;
  // display: -webkit-box;
  // -webkit-line-clamp: 5;
  // -webkit-box-orient: vertical;
  // overflow: hidden;
  // text-overflow: ellipsis;
`;

export const SubCategoryContainer = styled.div`
  height: calc(100% - 10rem);
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
  padding: 0 1.5rem;

  // .template-sub-category-scroll {
  //   display: grid;
  //   grid-template-columns: repeat(3, 1fr);
  //   gap: 1rem;
  //   margin: 0 -1rem;
  //   padding: 0 1rem;

  //   ${commonScrollCss}
  // }
`;

export const TemplateDescriptionContainer = styled.div`
  max-height: 100%;

  ${commonScrollCss}
`;

export const TemplateDescriptionWrapper = styled.div`
  position: relative;
  ${FLEX_CCC}

  .template-back-button {
    width: 5rem;
    height: 1.4rem;
    margin: 1rem 0 2rem 0;
    position: absolute;
    top: -0.5rem;
    border-color: transparent;
    background-color: transparent;
    ${RV_RevFloat}: 1rem;

    :hover {
      border-color: ${CV_RED};
    }
  }
`;

export const TemplateTitleInDescription = styled.div`
  text-align: center;
  margin: 2.5rem 0 1rem 0;
  ${commonTitleStyle}
`;

export const TemplatePhotosWrapper = styled.div`
  width: 70%;
  height: 16rem;

  .swiper-pagination {
    bottom: 0.3rem !important;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: ${TCV_DEFAULT};
  }

  .swiper-pagination-bullet {
    width: 1.2rem;
    height: 1.2rem;
    text-align: center;
    line-height: 1.4rem;
    font-size: 0.8rem;
    color: ${CV_BLACK};
    opacity: 1;
    background: rgba(0, 0, 0, 0.2);
  }

  .swiper-pagination-bullet-active {
    color: ${CV_WHITE};
    background: ${TCV_DEFAULT};
  }
`;

export const TemplateDescription = styled.div`
  text-align: justify;
  text-justify: inter-word;
  padding: 0 3rem;
  font-size: 0.9rem;
  line-height: 1.5rem;
  color: ${CV_DISTANT};
`;

import styled, { css } from 'styled-components';
import {
  FLEX_CCB,
  FLEX_CCC,
  FLEX_CEC,
  FLEX_CSC,
  FLEX_RCB,
  FLEX_RCS,
  FLEX_RSB,
} from 'constant/StyledCommonCss';
import {
  BO_RADIUS_CIRCLE,
  BO_RADIUS_HALF,
  BO_RADIUS_QUARTER,
  IGNORE_RADIUS_BOTTOM,
} from 'constant/constants';
import {
  BG_GRAY_LIGHT,
  BG_WHITE,
  BO_DISTANT,
  BO_FREEZED,
  C_DISTANT,
  TBG_VERY_SOFT,
  TC_DEFAULT,
  TC_VERYWARM,
  TC_WARM,
} from 'constant/Colors';
import {
  CV_BLACK,
  CV_DISTANT,
  CV_FREEZED,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_WARM,
} from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';

const { RV_RevFloat, RV_Float } = window;

export const selectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'inherit',
    borderColor: CV_FREEZED,
    cursor: 'pointer',
  }),
  option: (styles, { isSelected }) => ({
    ...styles,
    backgroundColor: isSelected && CV_DISTANT,
    width: '90%',
    margin: '0.3rem auto',
    borderRadius: '0.2rem',
    color: CV_BLACK,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: !isSelected && CV_FREEZED,
    },
    ':active': {
      ...styles[':active'],
      backgroundColor: isSelected && CV_DISTANT,
    },
    textTransform: 'capitalize',
  }),
  indicatorsContainer: (styles) => ({
    ...styles,
    svg: {
      color: TCV_DEFAULT,
    },
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none',
  }),
  singleValue: (styles) => ({
    ...styles,
    backgroundColor: CV_DISTANT,
    padding: '0.2rem',
    fontSize: '0.85rem',
    borderRadius: '0.2rem',
    width: '85%',
    textTransform: 'capitalize',
  }),
};

export const SearchViewContainer = styled.div`
  user-select: none;
  height: calc(100vh - 6rem);
  margin: 0 1.5rem;
  ${FLEX_RSB}
  gap: 1rem;
`;

export const SearchViewAside = styled.aside.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_QUARTER}`,
})`
  box-shadow: 1px 3px 15px #00000026;
  width: 18rem;
  max-width: 18rem;
  min-width: 18rem;
`;

export const SearchViewMain = styled.main.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_QUARTER}`,
})`
  height: 100%;
  width: 100%;
  box-shadow: 1px 5px 15px #0000001f;
  padding: 1rem 1rem 1rem 1.5rem;
`;

export const SearchAsideHeader = styled.header.attrs({
  className: `${BG_WHITE} ${BO_RADIUS_HALF} ${IGNORE_RADIUS_BOTTOM}`,
})`
  height: 3rem;
  width: 100%;
  padding: 0 1rem;
  ${FLEX_RCB}

  .search-view-aside-undo-icon {
    cursor: pointer;
    transform: scaleX(-1);
    color: ${CV_DISTANT};
  }

  .search-view-aside-close-icon {
    cursor: pointer;
    color: ${CV_RED};
  }
`;

export const SearchAsideHeaderTitle = styled.div.attrs({
  className: TC_WARM,
})`
  font-size: 1rem;
`;

export const SearchActionsContainer = styled.div``;

export const SearchActionsWrapper = styled.div`
  ${FLEX_RCB}
  gap: 3rem;
`;

export const SearchArea = styled.div`
  // border: 1px solid #333;
  width: 100%;
  ${FLEX_RCS}
  gap: 1rem;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 30rem;

  :focus-within svg {
    color: ${TCV_DEFAULT} !important;
  }

  input {
    width: calc(100% - 0.3rem);
  }

  .search-input-icon {
    position: absolute;
    ${RV_RevFloat}: 0.5rem;
    top: 0.5rem;
  }
`;

export const SearchViewHeaderTitle = styled.div.attrs({
  className: `${TC_WARM}`,
})`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;

export const SearchTypeButtonsContainer = styled.div`
  ${FLEX_RCB}
  gap: 0.5rem;

  .search-type-button {
    width: 5rem;
    height: 1.9rem;
    border-radius: 0.2rem;
    border-color: ${CV_DISTANT};
  }
`;

export const TemplateSelection = styled.div``;

export const SelectionTitle = styled.div.attrs({
  className: `${TC_VERYWARM}`,
})`
  ${FLEX_RCS}
  gap: 0.5rem;
`;

export const SelectionContainer = styled.div.attrs({
  className: `${BO_RADIUS_HALF} ${BG_WHITE}`,
})`
  margin-top: 0.5rem;
  min-height: 2.2rem;
  padding: 0.5rem;
  ${FLEX_RCB}
  gap: 0.5rem;
`;

export const DotsWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE} ${TBG_VERY_SOFT}`,
})`
  width: 2rem;
  height: 1.5rem;
  cursor: pointer;
  ${FLEX_CCC}
`;

export const SelectedTemplatesWrapper = styled.div`
  width: calc(100% - 2.5rem);
  ${FLEX_RCS}
  gap: 0.3rem;
  flex-wrap: wrap;
`;

export const SelectedTemplate = styled.div.attrs({
  className: `${BO_RADIUS_HALF} ${TBG_VERY_SOFT} ${TC_DEFAULT}`,
})`
  ${FLEX_RCB}
  gap: 0.5rem;
  min-width: 3rem;
  padding: 0.2rem 0.5rem 0.2rem 0.3rem;

  .search-selected-temp-close-icon {
    cursor: pointer;
    color: ${CV_DISTANT};

    :hover {
      color: ${CV_RED};
    }
  }
`;

export const Divider = styled.div.attrs({
  className: `${BO_FREEZED}`,
})`
  width: calc(100% + 2rem);
  margin: 1rem -1rem;
`;

export const TogglesContainer = styled.div`
  ${FLEX_CCB}
  gap: 1rem;
`;

export const TogglesTitle = styled.div.attrs({
  className: `${C_DISTANT}`,
})`
  width: 100%;
  padding: 0 0.5rem;
  font-size: 0.85rem;
`;

const openAsideCss = css`
  box-shadow: 0px 0px 10px #2b7be44d;
  color: ${TCV_DEFAULT};
`;

export const AdvanceButtonsWrapper = styled.div`
  ${FLEX_RCB}
  gap: 1rem;
  width: 8rem;

  .search-advanced-button {
    ${FLEX_RCB}
    width: 5rem;
    height: 2rem;
    border: none;
    padding-${RV_Float}: 0.6rem;
    border-radius: 1.5rem;
    background: ${CV_WHITE};
    color: ${CV_DISTANT};
    ${({ isAsideOpen }) => isAsideOpen && openAsideCss}
  }

  .search-export-excel {
    color: ${CV_DISTANT};
    cursor: pointer;

    :hover {
      color: ${TCV_DEFAULT};
    }
  }
`;

export const NotFoundContainer = styled(Heading)`
  ${FLEX_CCC}
  width: 26rem;
  margin: auto;
`;

export const NotFoundText = styled(Heading)`
  text-align: center;
  color: ${CV_DISTANT} !important;
`;

export const NotFoundQuestionWrapper = styled.div.attrs({
  className: `${BG_WHITE} ${BO_RADIUS_HALF}`,
})`
  ${FLEX_RCB}
  width: 100%;
  padding: 0.4rem;
  margin: 0.2rem;
  color: ${CV_DISTANT} !important;

  :hover,
  :hover div {
    color: ${TCV_DEFAULT} !important;
  }
`;

export const NotFoundQuestion = styled.div`
  ${FLEX_RCS}
  gap: 0.5rem;
`;

export const SearchAnimationContainer = styled.div`
  width: calc(100% - 1rem);
  ${FLEX_CCB}
  gap: 0.7rem;
`;

export const SearchListContainer = styled.div`
  height: calc(100% - 6rem);
  margin-top: 1.2rem;
  width: calc(100% + 1rem);
`;

export const SearchItemContainer = styled.div.attrs({
  className: `${BO_RADIUS_HALF} ${BO_DISTANT}`,
})`
  height: 4.8rem;
  width: calc(100% - 1rem);
  margin: 0.6rem 0;
  padding: 0.3rem;
  ${FLEX_RCB}

  :hover {
    border-color: ${TCV_DEFAULT};
  }
`;

export const SearchItemTypeWrapper = styled.div.attrs({
  className: `${BO_DISTANT}`,
})`
  height: 100%;
  width: 5rem;
  border-top: none;
  border-bottom: none;
  border-${RV_Float}: none;
  ${FLEX_CCC}
  gap: 0.5rem;

  .search-item-user-type{
    cursor: pointer;
    min-width: 3.5rem;
    width: 3.5rem;
    min-height: 3.5rem;
  }
`;

export const SearchItemInfoWrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 1rem;
  ${FLEX_RCB}
  gap: 1rem;
`;

export const SearchItemDate = styled(Heading)``;

export const SearchItemDescription = styled.div`
  height: 85%;
  max-width: 70%;
  ${FLEX_CSC}
  gap: 0.2rem;
`;

export const SearchItemMore = styled.div`
  height: 85%;
  width: 30%;
  ${FLEX_CEC}
  gap: 1rem;

  .search-item-avatar {
    cursor: pointer;
    min-width: 3rem;
    width: 3rem;
    min-height: 3rem;
  }
`;

export const SearchItemTitle = styled.div`
  font-weight: 500 !important;
  width: 100%;
  min-height: 2rem;
  font-size: 1rem;
  color: ${TCV_WARM};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SearchItemSubTitle = styled(Heading)`
  font-weight: 300 !important;
  width: 100%;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SearchItemFileTitle = styled(Heading).attrs({
  className: `${TBG_VERY_SOFT}`,
})`
  font-weight: 300 !important;
  max-width: 100%;
  text-align: ${RV_RevFloat};
  color: ${TCV_DEFAULT} !important;
  padding: 0.8rem;
  border-radius: 1rem;
  ${FLEX_CCC}

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SearchItemFileSubTitle = styled(Heading)`
  font-weight: 300 !important;
`;

export const SearchItemNodeSubTitle = styled(Heading).attrs({
  className: `${TBG_VERY_SOFT}`,
})`
  font-weight: 300 !important;
  color: ${TCV_DEFAULT} !important;
  padding: 0.3rem 0.5rem;
  border-radius: 1rem;
`;

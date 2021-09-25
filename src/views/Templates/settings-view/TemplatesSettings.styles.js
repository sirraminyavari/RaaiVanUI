import styled from 'styled-components';
import { BG_GRAY_LIGHT, BO_DISTANT, C_DISTANT, TC_WARM } from 'constant/Colors';
import { BO_RADIUS_HALF, BO_RADIUS_UNIT } from 'constant/constants';
import { FLEX_CCC, FLEX_RCB, FLEX_RCC } from 'constant/StyledCommonCss';
import {
  CV_DISTANT,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';

const { RV_Float, RV_RevFloat } = window;

export const TemplatesViewContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_UNIT}`,
})`
  position: relative;
  min-height: calc(100vh - 5.5rem);
  box-shadow: 1px 5px 15px #0000001f;
  margin: 1rem;
  padding: 1rem;
  padding-top: 3.5rem;
  user-select: none;

  .templates-breadcrumb {
    ${RV_Float}: 1rem;
  }
`;

export const TemplatesViewTitle = styled.div.attrs({
  className: `${TC_WARM}`,
})`
  font-size: 1.1rem;
  font-weight: bold;
`;

export const TemplatesActionContainer = styled.div`
  ${FLEX_RCB}
  margin-top: 2rem;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 50%;

  :focus-within svg {
    color: ${TCV_DEFAULT} !important;
  }

  .templates-view-input-icon {
    position: absolute;
    ${RV_RevFloat}: 0.5rem;
    top: 0.5rem;
  }
`;

export const ActionButtonsWrapper = styled.div`
  ${FLEX_RCB}
  gap: 0.5rem;
`;

export const ButtonWrapper = styled.div`
  position: relative;
  cursor: pointer;

  :hover {
    > div[data-type='archive'] {
      border: 1px solid ${CV_RED};
    }
  }

  .add-class-icon {
    position: absolute;
    top: 0.5rem;
    ${RV_Float}: 0.5rem;
    z-index: 500;
  }

  .archives-class-icon {
    position: absolute;
    top: 0.7rem;
    ${RV_Float}: 0.9rem;
    z-index: 500;
  }

  .add-class-button {
    width: 10rem;
  }

  .archives-class-button {
    width: 6rem;
    border: 1px solid ${CV_WHITE};
    background-color: ${CV_WHITE};
  }

  .archives-class-button-active {
    width: 6rem;
  }
`;

export const TemplatesListContainer = styled.div`
  margin-top: 2rem;
`;

export const ClassItemWrapper = styled.div`
  ${FLEX_RCB}
  cursor: pointer;
  margin: 1rem 0;
  width: max-content;
  min-width: 16rem;

  :hover {
    svg:last-child {
      color: ${CV_RED} !important;
    }
  }

  .trash-wrapper {
    padding: 0.4rem;
    border-radius: 50%;
    ${FLEX_RCC}
  }
`;

export const ClassItemTitle = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin: 0 0.5rem;
  ${({ isOther }) => isOther && `color: ${CV_DISTANT};`}
`;

export const ClassItemTitleWrapper = styled.div`
  ${FLEX_RCC}
`;

export const ClassTemplatesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 1rem;

  .class-template-card {
    cursor: pointer;
    height: 10rem;
    max-height: 10rem;

    :hover {
      border-color: ${TCV_DEFAULT};
    }
  }
`;

export const NewClassContainer = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_HALF}`,
})`
  width: 100%;
  height: 10rem;
  max-height: 10rem;
  padding: 0.7rem;
  border-style: dashed;
  border-width: 2px;
  cursor: pointer;

  :hover {
    border-color: ${TCV_DEFAULT};
    div {
      color: ${TCV_DEFAULT};
    }
  }
`;

export const NewClassWrapper = styled.div.attrs({
  className: `${C_DISTANT}`,
})`
  width: 100%;
  height: 100%;
  ${FLEX_CCC}
`;

export const NewClassLabel = styled.div.attrs({
  className: C_DISTANT,
})`
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
`;

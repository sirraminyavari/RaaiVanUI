import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY_DARK } from 'constant/CssVariables';
import { BO_DISTANT } from 'constant/Colors';
import { BO_RADIUS_QUARTER } from 'constant/constants';
import { FLEX_RCC } from 'constant/StyledCommonCss';

const { RV_Float } = window;

export const InputCellWrapper = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_QUARTER}`,
})`
  padding: 0.2rem;
  ${FLEX_RCC}

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    display: none;
  }

  .table-number-input {
    width: 100%;
    background-color: inherit;
    color: inherit;
    border: none;
  }
`;

export const EmptyCellView = styled.div`
  color: ${CV_DISTANT};
  width: 100%;
  text-align: start;
  padding-${RV_Float}: 0.7rem;
`;

export const CellView = styled.span`
  color: ${CV_GRAY_DARK};
  text-align: justify;
  text-justify: inter-word;
`;

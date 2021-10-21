import styled from 'styled-components';
import { CV_BLACK, CV_DISTANT, CV_WHITE } from 'constant/CssVariables';

const { RV_Float } = window;

export const BinaryCellWrapper = styled.div`
  .table-binary-cell {
    background-color: ${CV_WHITE};
    color: ${CV_BLACK};
  }
`;

export const EmptyCellView = styled.div`
  color: ${CV_DISTANT};
  width: 100%;
  text-align: start;
  padding-${RV_Float}: 0.7rem;
`;

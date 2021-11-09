import styled from 'styled-components';
import { CV_BLACK, CV_DISTANT, CV_WHITE } from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';
import { C_GRAY_DARK } from 'constant/Colors';

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

export const CellView = styled(Heading).attrs({
  className: `${C_GRAY_DARK}`,
})``;

export const CellViewContainer = styled.div`
  width: 100%;
`;

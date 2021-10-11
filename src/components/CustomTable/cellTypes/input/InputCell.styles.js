import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY_DARK } from 'constant/CssVariables';

export const EmptyCellView = styled.div`
  color: ${CV_DISTANT};
  width: 100%;
  text-align: start;
  padding-right: 0.7rem;
`;

export const CellView = styled.span`
  color: ${CV_GRAY_DARK};
  text-align: justify;
  text-justify: inter-word;
`;

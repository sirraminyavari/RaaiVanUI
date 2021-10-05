import styled from 'styled-components';
import { CV_GRAY } from 'constant/CssVariables';

export const EmptyCellView = styled.div`
  color: ${CV_GRAY};
  width: 100%;
  text-align: start;
  cursor: pointer;
  padding-right: 0.7rem;
`;

export const CellView = styled.span`
  text-align: justify;
  text-justify: inter-word;
  cursor: pointer;
`;

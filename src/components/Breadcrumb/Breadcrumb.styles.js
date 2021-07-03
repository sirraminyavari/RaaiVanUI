import styled from 'styled-components';
import { C_DISTANT } from 'constant/Colors';

export const BreadcrumbContainer = styled.div`
  position: absolute;
  ${({ dir }) => dir}: 2rem;
  top: 1rem;
`;

export const BreadcrumbItem = styled.span.attrs({
  className: C_DISTANT,
})`
  display: inline-block;
  font-size: 0.9rem;
  user-select: none;
  cursor: pointer;

  :hover {
    color: #000;
  }
`;

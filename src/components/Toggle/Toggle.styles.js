import { CV_DISTANT } from 'constant/CssVariables';
import styled from 'styled-components';

export const ToggleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ToggleTitleWrapper = styled.span`
  font-size: 0.85rem;
  margin: 0 0.5rem;
  text-transform: capitalize;

  ${({ disable }) => disable && `color: ${CV_DISTANT} !important;`}
  ${({ isClickable }) => isClickable && 'cursor: pointer;'}
`;

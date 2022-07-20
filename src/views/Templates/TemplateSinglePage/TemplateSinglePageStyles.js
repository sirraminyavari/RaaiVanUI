import styled from 'styled-components';
import Button from 'components/Buttons/Button';
import { CV_WHITE, CV_RED } from 'constant/CssVariables';

export const ReturnButton = styled(Button).attrs({
  type: 'negative-o',
})`
  position: absolute;
  top: 1rem;
  ${({ $rtl }) => ($rtl ? 'left: 1rem' : 'right: 1rem')};
  height: 2rem;
  width: 10rem;
  border: 0.0625rem solid ${CV_WHITE};

  &:hover {
    border: 0.0625rem solid ${CV_RED};
    background-color: ${CV_WHITE};
  }
`;
ReturnButton.displayName = 'ReturnButton';

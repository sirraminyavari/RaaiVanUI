import styled from 'styled-components';
import { TCV_DEFAULT } from 'constant/CssVariables';

export const Button = styled.button`
  outline: none;
  height: 2.7rem;
  border-radius: 0.8rem;
  border: 1px solid transparent;
  padding: 0 1.3rem;
  color: ${TCV_DEFAULT};
  transition: all 150ms ease-in-out;
  cursor: pointer;

  &:hover {
    border: 1px solid ${TCV_DEFAULT};
  }
`;

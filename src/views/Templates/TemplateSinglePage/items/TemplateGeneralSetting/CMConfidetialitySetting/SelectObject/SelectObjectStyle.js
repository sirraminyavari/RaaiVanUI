import styled from 'styled-components';
import { CV_RED, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';

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
Button.displayName = 'Button';

export const Container = styled.div`
  max-width: 300px;
  width: 100%;
  position: relative;
`;
Container.displayName = 'Container';

export const DropDown = styled.div`
  position: absolute;
  bottom: 2.5rem;
  right: 0;
  background-color: ${CV_WHITE};
  border-radius: 0.8rem;
  box-shadow: 1px 5px 20px #0000001f;
  height: 300px;
  max-width: 306px;
  width: 100%;
`;
DropDown.displayName = 'DropDown';

export const CloseButton = styled.button`
  height: 1.3rem;
  width: 1.3rem;
  outline: none;
  border: none;
  background-color: transparent;
  color: ${CV_RED};
  cursor: pointer;
`;

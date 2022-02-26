import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import { FLEX_CCC, FLEX_RCB, FLEX_RCS } from 'constant/StyledCommonCss';

export const Button = styled.button`
  outline: none;
  height: 2.7rem;
  border-radius: 0.8rem;
  border: 1px solid transparent;
  padding: 0 1.3rem;
  color: ${TCV_DEFAULT};
  transition: all 150ms ease-in-out;
  cursor: pointer;
  font-weight: 500;
  background-color: ${CV_WHITE};

  &:hover {
    border: 1px solid ${TCV_DEFAULT};
  }
`;
Button.displayName = 'Button';

export const Container = styled.div`
  display: flex;
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
  width: 306px;
`;
DropDown.displayName = 'DropDown';

const IconButton = styled.button`
  ${FLEX_CCC};
  height: 1.3rem;
  width: 1.3rem;
  outline: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
  margin: 0 0.3rem;
`;

export const ResizeButton = styled(IconButton)`
  color: ${TCV_DEFAULT};
`;

export const CloseButton = styled(IconButton)`
  color: ${CV_RED};
`;

export const AddNewGroupButtonContainer = styled.div`
  ${FLEX_RCS};
  height: 1.3rem;
  gap: 0.5rem;
  color: ${TCV_DEFAULT};
  user-select: none;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 0.5rem 0 1rem 0;
  cursor: pointer;
`;
AddNewGroupButtonContainer.displayName = 'AddNewGroupButtonContainer';

export const InputContainer = styled.div`
  ${FLEX_RCB};
  height: 1.5rem;
  width: 100%;
  border-bottom: 0.0625rem solid ${CV_DISTANT};
  height: 1.5rem;
  margin: 0.5rem 0;
  color: ${CV_DISTANT};
  padding: 0 0.2rem;
`;

export const Input = styled.input.attrs({
  type: 'text',
})`
  outline: none;
  border: none;
  width: 100%;
  color: ${CV_GRAY};
`;

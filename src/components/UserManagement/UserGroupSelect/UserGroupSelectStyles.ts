import RxInput from 'components/Inputs/RxInput';
import { FLEX_CCC, FLEX_RCB, FLEX_RCS } from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const Container = styled.div`
  display: inline-block;
  position: relative;
`;

export const ToggleButton = styled.button`
  outline: none;
  height: 2.7rem;
  border-radius: 0.8rem;
  border: 1px solid transparent;
  padding: 0 1.3rem;
  color: var(--rv-color);
  transition: all 150ms ease-in-out;
  cursor: pointer;
  font-weight: 500;
  background-color: var(--rv-white-color);
  min-width: 7rem;

  &:hover {
    border: 1px solid var(--rv-color);
  }
`;
ToggleButton.displayName = 'Button';

export const DropDown = styled.div`
  // position: absolute;
  // top: -1.5rem;
  // right: 3.5rem;
  background-color: var(--rv-white-color);
  border-radius: 0.8rem;
  box-shadow: 1px 5px 20px #0000001f;
  height: 300px;
  overflow-y: auto;
  width: 306px;
  z-index: 100;
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
  color: var(--rv-color);
`;

export const CloseButton = styled(IconButton)`
  color: var(--rv-red-color);
`;

export const InputContainer = styled.div`
  ${FLEX_RCB};
  height: 1.5rem;
  width: 100%;
  border-bottom: 0.0625rem solid var(--rv-color-distant);
  height: 1.5rem;
  margin: 0.5rem 0;
  color: var(--rv-color-distant);
  padding: 0 0.2rem;
`;

export const Input = styled(RxInput)`
  outline: none;
  border: none;
  width: 100%;
  color: var(--rv-gray-color);
`;

export const ObjectListWrapper = styled.div`
  width: 100%;
  height: 14.5rem;
  overflow: auto;
`;

export const ObjectItemContainer = styled.div`
  ${FLEX_RCB};
  height: 2rem;
`;

export const AddNewGroupButtonContainer = styled.div`
  ${FLEX_RCS};
  height: 1.3rem;
  gap: 0.5rem;
  color: var(--rv-color);
  user-select: none;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 0.5rem 0 1rem 0;
  cursor: pointer;
`;
AddNewGroupButtonContainer.displayName = 'AddNewGroupButtonContainer';

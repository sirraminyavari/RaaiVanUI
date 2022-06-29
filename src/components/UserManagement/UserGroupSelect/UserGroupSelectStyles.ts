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
  position: absolute;
  top: -1.5rem;
  right: 3.5rem;
  background-color: var(--rv-white-color);
  border-radius: 0.8rem;
  box-shadow: 1px 5px 20px #0000001f;
  height: 300px;
  width: 306px;
  z-index: 1;
`;
DropDown.displayName = 'DropDown';

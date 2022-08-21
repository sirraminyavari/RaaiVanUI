import styled from 'styled-components';
import {
  CV_DISTANT,
  TCV_DEFAULT,
  TCV_HIGHLY_TRANSPARENT,
} from 'constant/CssVariables';

export const BinaryInputFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 2.5rem;
  align-items: stretch;
  justify-content: space-between;
`;
BinaryInputFieldContainer.displayName = 'BinaryInputFieldContainer';

export const BinaryInputFieldItem = styled.div<{
  isSelected?: boolean;
  isFocused: boolean;
}>`
  padding: 0.5rem;
  min-width: 3rem;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-color: ${({ isSelected }) => (isSelected ? TCV_DEFAULT : CV_DISTANT)};
  font-weight: ${({ isSelected }) => (isSelected ? '600' : '400')};
  letter-spacing: -0.14px;
  border-width: 0.05rem;
  border-style: solid;
  transition: font 0.3s;
  width: 100%;

  &:not(:only-of-type):first-of-type {
    border-inline-end-width: 0;
    border-start-start-radius: 0.5rem;
    border-end-start-radius: 0.5rem;
    background-color: ${({ isSelected }) =>
      isSelected ? TCV_HIGHLY_TRANSPARENT : 'transparent'};
    color: ${({ isSelected }) => (isSelected ? TCV_DEFAULT : CV_DISTANT)};
  }
  &:not(:only-of-type):last-of-type {
    border-inline-start-width: 0;
    border-start-end-radius: 0.5rem;
    border-end-end-radius: 0.5rem;
    background-color: ${({ isSelected }) =>
      isSelected ? TCV_HIGHLY_TRANSPARENT : 'transparent'};
    color: ${({ isSelected }) => (isSelected ? TCV_DEFAULT : CV_DISTANT)};
  }
  &:only-of-type {
    border-radius: 0.5rem;
    border-color: ${CV_DISTANT};
  }

  ${({ isSelected, isFocused }) =>
    `border-color: ${isSelected && !isFocused && CV_DISTANT}`};
`;
BinaryInputFieldItem.displayName = 'BinaryInputFieldItem';

export const BinaryInputFieldDivider = styled.div<{
  isSelected?: boolean;
  isFocused?: boolean;
}>`
  width: 0.05rem;
  // height: 100%;
  background-color: ${({ isSelected }) =>
    isSelected ? TCV_DEFAULT : CV_DISTANT};
  ${({ isSelected, isFocused }) =>
    `background-color: ${isSelected && !isFocused && CV_DISTANT}`};
  margin: 0 0rem 0 0rem;
`;

BinaryInputFieldDivider.displayName = 'BinaryInputFieldDivider';

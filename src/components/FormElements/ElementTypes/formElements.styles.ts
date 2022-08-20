import { CV_DISTANT } from 'constant/CssVariables';
import styled from 'styled-components';

export const TextFieldBlurContext = styled.span<{ muted?: boolean }>`
  padding-block: 0.6rem;
  display: block;
  font-size: 1rem;
  ${({ muted }) => muted && `color:${CV_DISTANT};`}
`;
TextFieldBlurContext.displayName = 'TextFieldBlurContext';

export const SelectedFieldItem = styled.div<{ muted?: boolean }>`
  background-color: #e6f4f1;
  margin-block: 0.18rem;
  margin-inline: 0.5rem;
  padding-inline: 0.5rem;
  padding-block: 0.4rem;
  border-radius: 0.5rem;
  ${({ muted }) => muted && `color:${CV_DISTANT};`}
`;
SelectedFieldItem.displayName = 'SelectedFieldItem';

export const SelectedFieldItemContainer = styled.div<{
  muted?: boolean;
  onClick?: (event) => void;
}>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  ${({ muted }) => muted && `color:${CV_DISTANT};`}
  ${({ onClick }) => onClick && `cursor:pointer;`}
`;
SelectedFieldItemContainer.displayName = 'SelectedFieldItemContainer';

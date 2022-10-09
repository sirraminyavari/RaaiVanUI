import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';
import {
  CV_DISTANT,
  CV_GRAY,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';
import styled from 'styled-components';

export const TextFieldBlurContext = styled.span<{ muted?: boolean }>`
  padding-block: 0.6rem;
  display: block;
  ${({ muted }) => muted && `color:${CV_DISTANT};`}
`;
TextFieldBlurContext.displayName = 'TextFieldBlurContext';

export const SelectedFieldItem = styled.div<{
  muted?: boolean;
  selectInput?: boolean;
  chevron?: boolean;
}>`
  margin-block: 0.18rem;
  margin-inline: 0.5rem;
  padding-inline: 0.5rem;
  padding-block: 0.4rem;
  border-radius: 0.5rem;
  font-size: 0.93rem;
  display: flex;
  align-items: center;

  ${({ selectInput }) =>
    selectInput &&
    `
  background-color: ${TCV_VERY_TRANSPARENT};
  `}

  ${({ chevron }) =>
    chevron &&
    `
  margin-inline: 0rem;
  padding-inline: 0rem;
  `}

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

export const SelectedFieldTextCounterContainer = styled.div<{
  muted?: boolean;
}>`
  width: 100%;
  text-align: end;
  padding-block: 0.25rem;
  padding-inline: 0;
  ${({ muted }) => muted && `color:${CV_DISTANT};`};
`;
SelectedFieldTextCounterContainer.displayName =
  'SelectedFieldTextCounterContainer';

export const SelectedFieldChevron = styled(ChevronIcon)`
  color: ${CV_GRAY};
`;
SelectedFieldChevron.displayName = 'SelectedFieldChevron';

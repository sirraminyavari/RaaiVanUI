import styled from 'styled-components';
import { FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_GRAY_DARK, CV_RED } from 'constant/CssVariables';

export const Container = styled.div`
  margin-top: 4rem;
`;
Container.displayName = 'Container';

export const SelectionBlock = styled.div`
  height: 3rem;
  ${FLEX_RCS};
  gap: 0.75rem;
`;
SelectionBlock.displayName = 'SelectionBlock';

export const BlockTitle = styled.div`
  width: 11.25rem;
  font-weight: 500;
  color: ${CV_GRAY_DARK};
`;
BlockTitle.displayName = 'BlockTitle';

export const BlockSelectWrapper = styled.div`
  max-width: 23.5rem;
  width: 100%;
`;
BlockSelectWrapper.displayName = 'BlockSelectWrapper';

export const MessageContainer = styled.div`
  color: ${CV_RED};
  ${FLEX_RCS};
  gap: 0.5rem;
  margin-top: 2.5rem;
  font-weight: 500;
`;

export const AdvancedSelectionContainer = styled.div`
  margin-top: 1.5rem;
`;
AdvancedSelectionContainer.displayName = 'AdvancedSelectionContainer';

export const CustomizedSelectionContainer = styled.div`
  min-width: 7rem;
  ${FLEX_RCS};
  gap: 0.5rem;
`;
CustomizedSelectionContainer.displayName = 'CustomizedSelectionContainer';

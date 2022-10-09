import styled from 'styled-components';
import { FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_GRAY_DARK, CV_RED } from 'constant/CssVariables';
import { MEDIUM_BOUNDRY, MOBILE_BOUNDRY } from 'constant/constants';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-top: 4rem;
  max-width: 60rem;
  width: 100%;
`;
Container.displayName = 'Container';

export const SelectionBlock = styled.div`
  height: 3rem;
  ${FLEX_RCS};
  gap: 0.75rem;
  flex-direction: row;

  @media screen and (max-width: ${MOBILE_BOUNDRY}) {
    flex-direction: column;
  }
`;
SelectionBlock.displayName = 'SelectionBlock';

export const SelectorBlock = styled.div`
  height: 3rem;
  ${FLEX_RCS};
  gap: 0.75rem;
  width: 100%;
  flex-direction: row;

  @media screen and (max-width: ${MEDIUM_BOUNDRY}) {
    flex-direction: column;
  }
`;

export const BlockTitle = styled.div`
  width: 11.25rem;
  font-weight: 500;
  color: ${CV_GRAY_DARK};
`;
BlockTitle.displayName = 'BlockTitle';

export const BlockSelectWrapper = styled.div`
  max-width: 23.5rem;
  width: 100%;
  grid-column: 2 / span 2;
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

import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY_DARK } from 'constant/CssVariables';
import { FLEX_RCB } from 'constant/StyledCommonCss';
import { MEDIUM_BOUNDRY } from 'constant/constants';

export const Container = styled.div`
  padding: 0 1.5rem;
  width: 100%;
`;
Container.displayName = 'Container';

export const Block = styled.div`
  margin: 2.2rem 0 0 0;
`;
Block.displayName = 'Block';

export const Title = styled.div`
  font-size: 0.85rem;
  color: ${CV_DISTANT};
  margin-bottom: 1.5rem;
`;
Title.displayName = 'Title';

export const Section = styled.div`
  ${FLEX_RCB};
  margin-bottom: 1.5rem;
`;
Section.displayName = 'Section';

export const ItemTitle = styled.div`
  font-size: 1rem;
  color: ${CV_GRAY_DARK};
  width: 13rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
ItemTitle.displayName = 'ItemTitle';

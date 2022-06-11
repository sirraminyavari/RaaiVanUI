import { FLEX_RCB, ViewContentCard } from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const TemplateItemContainer = styled.div`
  ${ViewContentCard};
  min-height: calc(100vh - 6.5rem);
`;
TemplateItemContainer.displayName = 'TemplateItemContainer';

export const TemplateItemTitleSection = styled.div`
  ${FLEX_RCB};
  gap: 0.75rem;
`;
TemplateItemTitleSection.displayName = 'TemplateItemTitleSection';

export const Spacer = styled.div`
  flex: 1;
`;

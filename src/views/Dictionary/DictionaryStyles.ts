import { FLEX_CSB, FLEX_RSB, FLEX_RSS } from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  position: relative;
`;

export const ContentWrapper = styled.div`
  ${FLEX_RSB};
  gap: 1rem;
  height: calc(100vh - 4rem);
`;

export const SelectedItemContent = styled.div`
  padding: 2.5rem 2.5rem 1.5rem 2.5rem;
  ${FLEX_RSB};
  gap: 1rem;
  width: 100%;
  height: calc(100vh - 4rem);
`;

export const DictionaryInputContainer = styled.div`
  ${FLEX_CSB};
  gap: 1rem;
  height: 100%;
  flex: 2.5;
`;

export const DictionaryDetail = styled.div`
  flex: 1;
`;

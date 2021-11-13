import styled from 'styled-components';

export const ListContainer = styled.div`
  margin: ${({ top, bottom }) => `${top}rem auto ${bottom}rem auto`};
`;

export const ListHeader = styled.div`
  display: flex;
  flex-direction: ${({ rtl }) => (rtl ? 'row' : 'row-reverse')};
  justify-content: space-between;
  align-items: center;
  height: 4.625rem;
  border-bottom: 0.08rem solid var(--rv-color-distant);
`;

export const ListBody = styled.div`
  display: flex;
  flex-direction: ${({ rtl }) => (rtl ? 'row' : 'row-reverse')};
  justify-content: space-between;
  align-items: center;
  height: 5.125rem;
  border-bottom: 0.08rem solid var(--rv-color-distant);
`;

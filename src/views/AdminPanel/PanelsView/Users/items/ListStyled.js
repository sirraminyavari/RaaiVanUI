import styled from 'styled-components';

export const ListContainer = styled.div`
  margin: ${({ top, bottom }) => `${top ?? 0}rem auto ${bottom ?? 0}rem auto`};
`;

export const ListHeader = styled.div`
  display: flex;
  flex-flow: ${({ rtl }) => (rtl ? 'row wrap' : 'wrap-reverse')};
  justify-content: space-between;
  align-items: center;
  height: 2.8rem;
  border-bottom: 0.08rem solid var(--rv-color-distant);
  color: var(--rv-color-distant);
`;

export const ListHeaderItem = styled.div`
  flex-grow: ${({ grow }) => grow ?? 0.5};
  display: flex;
`;

export const ListBody = styled.div`
  transition: height 0.25s ease-in;
`;

export const ListRow = styled.div`
  display: flex;
  flex-flow: ${({ rtl }) => (rtl ? 'row wrap' : 'wrap-reverse')};
  justify-content: space-between;
  align-items: center;
  height: 5.125rem;
`;

export const ListBodyItem = styled.div`
  flex: ${({ grow }) => grow ?? 0.5};
  display: flex;
  border-bottom: 0.08rem solid var(--rv-color-distant);
  height: 5.125rem;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 1px solid red;
`;

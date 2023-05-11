import styled from 'styled-components';

export const ListContainer = styled.table`
  margin: ${({ top, bottom }) => `${top ?? 0}rem auto ${bottom ?? 0}rem auto`};
  display: block;
  width: 100%;
`;
ListContainer.displayName = 'ListContainer';

export const ListHeader = styled.thead`
  display: block;
`;
ListHeader.displayName = 'ListHeader';

export const ListHeaderRow = styled.tr`
  display: block;
  // height: 2.8rem;
  line-height: 2.8rem;
  border-bottom: 0.08rem solid var(--rv-color-distant);
  color: var(--rv-color-distant);
`;
ListHeaderRow.displayName = 'ListHeaderRow';

export const ListHeaderItem = styled.th`
  display: inline-block;
  width: ${({ width }) => width}%;
  text-align: ${({ centralized }) => (centralized ? 'center' : 'auto')};
  font-weight: 400;
  user-select: none;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
ListHeaderItem.displayName = 'ListHeaderItem';

export const ListBody = styled.tbody`
  display: block;
`;
ListBody.displayName = 'ListBody';

export const ListRow = styled.tr`
  display: block;
  // height: 5.125rem;
  line-height: 5.125rem;
  border-bottom: 0.08rem solid var(--rv-color-distant);
`;
ListRow.displayName = 'ListRow';

export const ListBodyItem = styled.td`
  display: inline-block;
  width: ${({ width }) => width}%;
  overflow: hidden;
  user-select: none;
`;
ListBodyItem.displayName = 'ListBodyItem';

export const ShowMoreButton = styled.button`
  background-color: white;
  outline: none;
  width: 9.7rem;
  // height: 2rem;
  line-height: 2rem;
  color: var(--rv-color-actionbutton);
  border: 1px solid transparent;
  border-radius: 0.45rem;
  margin-top: 0.7rem;
  transition: all ease-out 0.3s;

  &:hover {
    border: 1px solid var(--rv-color-actionbutton);
  }
`;
ShowMoreButton.displayName = 'ShowMoreButton';

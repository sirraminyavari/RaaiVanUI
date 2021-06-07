/**
 * Renders a list of searched items in sidebar.
 */
import { memo } from 'react';
import { useSelector } from 'react-redux';
import * as Styled from '../../../Sidebar.styles';
import { createSelector } from 'reselect';
import SearchResultItem from './SearchResultItem';
import useWindow from 'hooks/useWindowContext';

const selectDnDTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.dndTree
);

const selectSearchText = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.searchText
);

const SearchResultsList = () => {
  const dndTree = useSelector(selectDnDTree);
  const searchText = useSelector(selectSearchText);
  const { GlobalUtilities } = useWindow();

  const nodes = Object.values(dndTree.items).filter((node) => {
    if (!!node.isCategory) return false;
    return true;
  });

  return (
    <Styled.MenuTreeContainer>
      {nodes
        .filter((node) =>
          GlobalUtilities.is_search_match(node.data.title, searchText)
        )
        .map((node) => {
          return (
            <SearchResultItem
              node={node}
              searchText={searchText}
              key={node.id}
            />
          );
        })}
    </Styled.MenuTreeContainer>
  );
};

export default memo(SearchResultsList);

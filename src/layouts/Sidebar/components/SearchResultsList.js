/**
 * Renders a list of searched items in sidebar.
 */
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { decode } from 'js-base64';
import * as Styled from '../Sidebar.styles';
import { createSelector } from 'reselect';
import SearchResultItem from './SearchResultItem';

const { GlobalUtilities } = window;

const selectNodeTypes = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.nodeTypes
);

const selectSearchText = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.searchText
);

const SearchResultsList = () => {
  const nodeTypes = useSelector(selectNodeTypes);
  const searchText = useSelector(selectSearchText);

  return (
    <Styled.MenuTreeContainer>
      {nodeTypes
        .filter((node) =>
          GlobalUtilities.is_search_match(decode(node.TypeName), searchText)
        )
        .map((node) => {
          return (
            <SearchResultItem
              node={node}
              searchText={searchText}
              key={node.NodeTypeID}
            />
          );
        })}
    </Styled.MenuTreeContainer>
  );
};

export default memo(SearchResultsList);

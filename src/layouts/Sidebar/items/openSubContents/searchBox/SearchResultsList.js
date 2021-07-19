/**
 * Renders a list of searched items in sidebar.
 */
import { memo } from 'react';
import { useSelector } from 'react-redux';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import { createSelector } from 'reselect';
import SearchResultItem from './SearchResultItem';
import useWindow from 'hooks/useWindowContext';
import { decodeBase64 } from 'helpers/helpers';

const selectSidebarNodes = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.nodeTypes
);

const selectSearchText = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.searchText
);

const SearchResultsList = () => {
  const sidebarNodes = useSelector(selectSidebarNodes);
  const searchText = useSelector(selectSearchText);
  const { GlobalUtilities } = useWindow();

  // const nodes = sidebarNodes.filter((node) => {
  //   if (!!node.IsCategory) return false;
  //   return true;
  // });

  return (
    <Styled.MenuTreeContainer>
      {sidebarNodes
        ?.filter((node) =>
          GlobalUtilities.is_search_match(
            decodeBase64(node?.TypeName),
            searchText
          )
        )
        .map((node) => {
          return (
            <SearchResultItem
              node={node}
              searchText={searchText}
              key={node?.NodeTypeID}
            />
          );
        })}
    </Styled.MenuTreeContainer>
  );
};

export default memo(SearchResultsList);

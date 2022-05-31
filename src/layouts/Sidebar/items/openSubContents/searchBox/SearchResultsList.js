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
import { selectSidebar } from 'store/slice/sidebar/selectors';

const SearchResultsList = () => {
  const { nodeTypes: sidebarNodeTypes, searchText } =
    useSelector(selectSidebar);
  const { GlobalUtilities } = useWindow();

  // const nodes = sidebarNodes.filter((node) => {
  //   if (!!node.IsCategory) return false;
  //   return true;
  // });

  return (
    <Styled.MenuTreeContainer>
      {sidebarNodeTypes
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

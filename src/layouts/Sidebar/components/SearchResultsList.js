/**
 * Renders a list of searched items in sidebar.
 */
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { decode } from 'js-base64';
import * as Styled from '../Sidebar.styles';

const { GlobalUtilities } = window;

const SearchResultsList = () => {
  const { nodeTypes, searchText } = useSelector((state) => state.sidebarItems);

  return (
    <Styled.MenuTreeContainer>
      {nodeTypes
        .filter((node) =>
          GlobalUtilities.is_search_match(decode(node.TypeName), searchText)
        )
        .map((node) => {
          return (
            <Styled.MenuContainer
              as={Link}
              to={`/classes/${node.NodeTypeID}`}
              key={node.NodeTypeID}>
              <Styled.MenuTitle>
                <img src={node.IconURL} alt="menu-icon" />
                <span style={{ marginRight: '5px' }}>
                  {decode(node.TypeName)}
                </span>
              </Styled.MenuTitle>
            </Styled.MenuContainer>
          );
        })}
    </Styled.MenuTreeContainer>
  );
};

export default SearchResultsList;

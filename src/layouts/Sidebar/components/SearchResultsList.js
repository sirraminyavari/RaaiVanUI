/**
 * Renders a list of searched items in sidebar.
 */
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { decode } from 'js-base64';
import { BG_WARM } from 'constant/Colors';
import * as Styled from '../Sidebar.styles';

const { GlobalUtilities } = window;

//! Highlights some terms inside a text.
const getHighlightedText = (text, highlight) => {
  const sanitized = highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const parts = text.split(new RegExp(`(${sanitized})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => {
        let isMatch = part.toLowerCase() === highlight.toLowerCase();
        return (
          <Styled.HighlightedText
            key={i}
            className={isMatch ? BG_WARM : null}
            isMatch={isMatch}>
            {part}
          </Styled.HighlightedText>
        );
      })}
    </span>
  );
};

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
                  {getHighlightedText(decode(node.TypeName), searchText)}
                </span>
              </Styled.MenuTitle>
            </Styled.MenuContainer>
          );
        })}
    </Styled.MenuTreeContainer>
  );
};

export default SearchResultsList;

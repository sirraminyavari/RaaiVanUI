/**
 * Renders a single searched item to be shown in search list.
 */
import { memo } from 'react';
import { Link } from 'react-router-dom';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import { decodeBase64, getURL } from 'helpers/helpers';

//! Highlights some terms inside a text.
const getHighlightedText = (text, highlight) => {
  const sanitized = highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const parts = text.split(new RegExp(`(${sanitized})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) => {
        let isMatch = part.toLowerCase() === highlight.toLowerCase();
        return (
          <Styled.HighlightedText key={index} isMatch={isMatch}>
            {part}
          </Styled.HighlightedText>
        );
      })}
    </span>
  );
};

const SearchResultItem = ({ node, searchText }) => {
  const { NodeTypeID, TypeName, IconURL } = node;
  return (
    <Styled.MenuContainer
      className="BorderRadius4"
      as={Link}
      to={getURL('Classes', { NodeTypeID: NodeTypeID })}
      key={NodeTypeID}>
      <Styled.MenuTitle>
        <Styled.MenuItemImage src={IconURL} alt="menu-icon" />
        <Styled.HighlightedTitle>
          {getHighlightedText(decodeBase64(TypeName), searchText)}
        </Styled.HighlightedTitle>
      </Styled.MenuTitle>
    </Styled.MenuContainer>
  );
};

export default memo(SearchResultItem);

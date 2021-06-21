/**
 * Renders a single searched item to be shown in search list.
 */
import { memo } from 'react';
import { Link } from 'react-router-dom';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';

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
  const { id, data } = node;
  return (
    <Styled.MenuContainer
      className="BorderRadius4"
      as={Link}
      to={`/classes/${id}`}
      key={id}>
      <Styled.MenuTitle>
        <Styled.MenuItemImage src={data.iconURL} alt="menu-icon" />
        <Styled.HighlightedTitle>
          {getHighlightedText(data.title, searchText)}
        </Styled.HighlightedTitle>
      </Styled.MenuTitle>
    </Styled.MenuContainer>
  );
};

export default memo(SearchResultItem);

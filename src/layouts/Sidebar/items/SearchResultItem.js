/**
 * Renders a single searched item to be shown in search list.
 */
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { BG_WARM } from 'constant/Colors';
import { decode } from 'js-base64';
import * as Styled from '../Sidebar.styles';

//! Highlights some terms inside a text.
const getHighlightedText = (text, highlight) => {
  const sanitized = highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const parts = text.split(new RegExp(`(${sanitized})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) => {
        let isMatch = part.toLowerCase() === highlight.toLowerCase();
        return (
          <Styled.HighlightedText
            key={index}
            className={isMatch ? BG_WARM : null}
            isMatch={isMatch}>
            {part}
          </Styled.HighlightedText>
        );
      })}
    </span>
  );
};

const SearchResultItem = ({ node, searchText }) => {
  const { NodeTypeID, IconURL, TypeName } = node;
  return (
    <Styled.MenuContainer
      className="BorderRadius4"
      as={Link}
      to={`/classes/${NodeTypeID}`}
      key={NodeTypeID}>
      <Styled.MenuTitle>
        <Styled.MenuItemImage src={IconURL} alt="menu-icon" />
        <Styled.HighlightedTitle>
          {getHighlightedText(decode(TypeName), searchText)}
        </Styled.HighlightedTitle>
      </Styled.MenuTitle>
    </Styled.MenuContainer>
  );
};

export default memo(SearchResultItem);

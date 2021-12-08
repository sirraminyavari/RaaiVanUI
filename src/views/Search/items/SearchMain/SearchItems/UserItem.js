import { Link } from 'react-router-dom';
import { useContext } from 'react';
import reactStringReplace from 'react-string-replace';
import { searchContext } from 'views/Search/SearchView';
import * as Styled from 'views/Search/SearchView.styles';
import Avatar from 'components/Avatar/Avatar';
import { decodeBase64 } from 'helpers/helpers';
import { TCV_DEFAULT } from 'constant/CssVariables';

const UserItem = ({ item }) => {
  const { IconURL, Title, ID } = item || {};
  const { searchText } = useContext(searchContext);

  const userTitle = reactStringReplace(
    decodeBase64(Title),
    searchText,
    (match, i) => {
      return <span style={{ color: TCV_DEFAULT }}>{match}</span>;
    }
  );

  return (
    <Styled.SearchItemContainer>
      <Styled.SearchItemTypeWrapper as={Link} to={`/user/${ID}`}>
        <Avatar userImage={IconURL} className="search-item-user-type" />
      </Styled.SearchItemTypeWrapper>
      <Styled.SearchItemInfoWrapper>
        <Styled.SearchItemDescription>
          <Styled.SearchItemTitle as={Link} to={`/user/${ID}`} type="h4">
            {userTitle}
          </Styled.SearchItemTitle>
        </Styled.SearchItemDescription>
      </Styled.SearchItemInfoWrapper>
    </Styled.SearchItemContainer>
  );
};

export default UserItem;

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import reactStringReplace from 'react-string-replace';
import { searchContext } from 'views/Search/SearchView';
import * as Styled from 'views/Search/SearchView.styles';
import OpenMailIcon from 'components/Icons/MailIcon/OpenMailIcon';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import Avatar from 'components/Avatar/Avatar';
import { decodeBase64 } from 'helpers/helpers';
import CreationDateLabel from './CreationDateLabel';

const NodeItem = ({ item }) => {
  const {
    // AdditionalID,
    // Description,
    ID,
    IconURL,
    // ItemType,
    Type,
    Title,
  } = item;

  const { searchText } = useContext(searchContext);

  const title = reactStringReplace(
    decodeBase64(Title),
    searchText,
    (match, i) => {
      return (
        <span key={i} style={{ color: TCV_DEFAULT }}>
          {match}
        </span>
      );
    }
  );

  return (
    <Styled.SearchItemContainer>
      <Styled.SearchItemTypeWrapper>
        <OpenMailIcon size={33} color={CV_DISTANT} />
        <CreationDateLabel {...item} />
      </Styled.SearchItemTypeWrapper>
      <Styled.SearchItemInfoWrapper>
        <Styled.SearchItemDescription>
          <Styled.SearchItemTitle as={Link} to={`/node/${ID}`} type="h4">
            {title}
          </Styled.SearchItemTitle>
          <Styled.SearchItemNodeSubTitle type="h6">
            {decodeBase64(Type)}
          </Styled.SearchItemNodeSubTitle>
        </Styled.SearchItemDescription>
        <Styled.SearchItemMore>
          <Avatar userImage={IconURL} className="search-item-avatar" />
        </Styled.SearchItemMore>
      </Styled.SearchItemInfoWrapper>
    </Styled.SearchItemContainer>
  );
};

export default NodeItem;

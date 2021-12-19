import { Link } from 'react-router-dom';
import { useContext } from 'react';
import reactStringReplace from 'react-string-replace';
import { searchContext } from 'views/Search/SearchView';
import * as Styled from 'views/Search/SearchView.styles';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import Avatar from 'components/Avatar/Avatar';
import { decodeBase64, getURL } from 'helpers/helpers';

const QuestionItem = ({ item }) => {
  const { Title, ID, Description } = item || {};
  const { searchText } = useContext(searchContext);

  const question = reactStringReplace(
    decodeBase64(Title),
    searchText,
    (match, i) => {
      return <span style={{ color: TCV_DEFAULT }}>{match}</span>;
    }
  );

  return (
    <Styled.SearchItemContainer>
      <Styled.SearchItemTypeWrapper>
        <QuestionIcon format="word" size={30} color={CV_DISTANT} />
        {/* <Styled.SearchItemDate type="h6">1395/09/06</Styled.SearchItemDate> */}
      </Styled.SearchItemTypeWrapper>
      <Styled.SearchItemInfoWrapper>
        <Styled.SearchItemDescription>
          <Styled.SearchItemTitle
            as={Link}
            to={getURL('Question', { QuestionID: ID })}
            type="h4">
            {question}
          </Styled.SearchItemTitle>
          <Styled.SearchItemSubTitle type="h6">
            بخشی از متن فایل در این قسمت نوشته میشود، که میتواند کلمه جستجوشده
            سپهر را شامل شود
          </Styled.SearchItemSubTitle>
        </Styled.SearchItemDescription>
        <Styled.SearchItemMore>
          <Avatar
            userImage={window.RVGlobal.CurrentUser.ProfileImageURL}
            className="search-item-avatar"
          />
        </Styled.SearchItemMore>
      </Styled.SearchItemInfoWrapper>
    </Styled.SearchItemContainer>
  );
};

export default QuestionItem;

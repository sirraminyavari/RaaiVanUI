import * as Styled from 'views/Search/SearchView.styles';
import { CV_DISTANT } from 'constant/CssVariables';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import Avatar from 'components/Avatar/Avatar';

const QuestionItem = () => {
  return (
    <Styled.SearchItemContainer>
      <Styled.SearchItemTypeWrapper>
        <QuestionIcon format="word" size={30} color={CV_DISTANT} />
        <Styled.SearchItemDate type="h6">1395/09/06</Styled.SearchItemDate>
      </Styled.SearchItemTypeWrapper>
      <Styled.SearchItemInfoWrapper>
        <Styled.SearchItemDescription>
          <Styled.SearchItemTitle type="h4">
            عنوان پرسش سپهر
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

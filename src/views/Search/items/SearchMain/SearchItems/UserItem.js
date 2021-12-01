import * as Styled from 'views/Search/SearchView.styles';
import Avatar from 'components/Avatar/Avatar';

const UserItem = () => {
  return (
    <Styled.SearchItemContainer>
      <Styled.SearchItemTypeWrapper>
        <Avatar
          userImage={window.RVGlobal.CurrentUser.ProfileImageURL}
          className="search-item-user-type"
        />
      </Styled.SearchItemTypeWrapper>
      <Styled.SearchItemInfoWrapper>
        <Styled.SearchItemDescription>
          <Styled.SearchItemTitle type="h4">
            سپهر ملازاده
          </Styled.SearchItemTitle>
        </Styled.SearchItemDescription>
      </Styled.SearchItemInfoWrapper>
    </Styled.SearchItemContainer>
  );
};

export default UserItem;

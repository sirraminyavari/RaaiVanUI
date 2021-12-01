import * as Styled from 'views/Search/SearchView.styles';
import OpenMailIcon from 'components/Icons/MailIcon/OpenMailIcon';
import { CV_DISTANT } from 'constant/CssVariables';
import Avatar from 'components/Avatar/Avatar';

const NodeItem = () => {
  return (
    <Styled.SearchItemContainer>
      <Styled.SearchItemTypeWrapper>
        <OpenMailIcon size={33} color={CV_DISTANT} />
        <Styled.SearchItemDate type="h6">1395/09/06</Styled.SearchItemDate>
      </Styled.SearchItemTypeWrapper>
      <Styled.SearchItemInfoWrapper>
        <Styled.SearchItemDescription>
          <Styled.SearchItemTitle type="h4">
            نامه دستورالعمل ساختار شکست پروژه سپهر
          </Styled.SearchItemTitle>
          <Styled.SearchItemNodeSubTitle type="h6">
            مدیریت محصول
          </Styled.SearchItemNodeSubTitle>
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

export default NodeItem;

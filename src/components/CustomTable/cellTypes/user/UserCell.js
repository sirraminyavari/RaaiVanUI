import { Link } from 'react-router-dom';
import * as Styled from './UserCell.styles';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { CV_BLACK, CV_DISTANT } from 'constant/CssVariables';
import Avatar from 'components/Avatar/Avatar';

const UserCell = (props) => {
  return (
    <Styled.UsersWrapper>
      {[1, 2].map((index) => (
        <Styled.UserCellContainer key={index}>
          <Styled.UserInfoWrapper
            as={Link}
            to="/user"
            editable={props?.header?.options?.editable?.toString()}>
            <Avatar
              color={CV_BLACK}
              className="table-user-avatar"
              userImage={
                props?.value?.userImageURL || 'https://i.pravatar.cc/300'
              }
            />
            <Styled.UserLinkWrapper>رسول حسامی رستمی</Styled.UserLinkWrapper>
          </Styled.UserInfoWrapper>
          <Styled.CloseIconWrapper>
            <CloseIcon color={CV_DISTANT} />
          </Styled.CloseIconWrapper>
        </Styled.UserCellContainer>
      ))}
    </Styled.UsersWrapper>
  );
};

export default UserCell;

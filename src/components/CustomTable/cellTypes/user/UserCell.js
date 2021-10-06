import { Link } from 'react-router-dom';
import * as Styled from './UserCell.styles';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { CV_BLACK, CV_DISTANT } from 'constant/CssVariables';
import Avatar from 'components/Avatar/Avatar';
import { decodeBase64, getURL } from 'helpers/helpers';

const UserCell = (props) => {
  const { userInfo, cell } = props?.value || {};
  const users = cell?.SelectedItems;

  return (
    <Styled.UsersWrapper>
      {users?.map((user, index) => (
        <Styled.UserCellContainer key={user?.UserID || index}>
          <Styled.UserInfoWrapper
            as={Link}
            to={getURL('User', { UserID: user?.UserID })}
            editable={props?.header?.options?.editable?.toString()}>
            <Avatar
              color={CV_BLACK}
              className="table-user-avatar"
              userImage={user?.IconURL}
            />
            <Styled.UserLinkWrapper>
              {decodeBase64(user?.FullName)}
            </Styled.UserLinkWrapper>
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

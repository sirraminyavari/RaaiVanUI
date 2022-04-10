import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';
import * as Styled from './UserCell.styles';
import { decodeBase64, getURL } from 'helpers/helpers';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { CV_BLACK, CV_DISTANT } from 'constant/CssVariables';

const UsersList = (props) => {
  const { users, canEdit, onRemoveUser } = props;

  const handleRemoveUser = (user) => {
    onRemoveUser && onRemoveUser(user);
  };

  const handleViewUser = (userId) => {
    let url = getURL('User', { UserID: userId });
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <Styled.UsersListWrapper>
      {users?.map((user, index) => {
        const { UserID, IconURL, FullName } = user;
        return (
          <Styled.UserCellContainer key={UserID || index}>
            <Styled.UserInfoWrapper
              onClick={(e) => {
                if (!canEdit) return;
                e.stopPropagation();
                handleViewUser(UserID);
              }}
              editable={canEdit}
            >
              <Avatar
                color={CV_BLACK}
                className="table-user-avatar"
                userImage={IconURL}
              />
              <Styled.UserLinkHeading className="table-user-view" type="h6">
                {decodeBase64(FullName)}
              </Styled.UserLinkHeading>
            </Styled.UserInfoWrapper>
            {canEdit && (
              <Styled.CloseIconWrapper onClick={() => handleRemoveUser(user)}>
                <CloseIcon color={CV_DISTANT} />
              </Styled.CloseIconWrapper>
            )}
          </Styled.UserCellContainer>
        );
      })}
    </Styled.UsersListWrapper>
  );
};

export default UsersList;

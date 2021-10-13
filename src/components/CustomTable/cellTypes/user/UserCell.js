import { Link } from 'react-router-dom';
import * as Styled from './UserCell.styles';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import { CV_BLACK, CV_DISTANT, TCV_WARM } from 'constant/CssVariables';
import Avatar from 'components/Avatar/Avatar';
import { decodeBase64, getURL, toJSON } from 'helpers/helpers';
import Heading from 'components/Heading/Heading';

const UserCell = (props) => {
  const {
    isNew,
    row,
    editingRow,
    onCellChange,
    column,
    value,
    editable: isTableEditable,
    header,
  } = props;

  const { SelectedItems: users, Info } = value || {};
  const userInfo = toJSON(decodeBase64(Info));

  return (
    <Styled.UsersWrapper>
      {!users?.length && (
        <Styled.AddNewUser>
          <PlusIcon size={20} color={TCV_WARM} />
          <Heading type="h5">افزودن کاربر</Heading>
        </Styled.AddNewUser>
      )}
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

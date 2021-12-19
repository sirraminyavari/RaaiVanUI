import * as Styled from '../UsersListStyled';
import UserFullNameTitle from './UserFullNameTitle';
import ResetPassword from './ResetPassword';
import { useCallback, useMemo, useState } from 'react';
import InlineEditableTitle from './InlineEditableTitle';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import UserGroupEdit from './UserGroupEdit';
import EditableTitle from './EditableTitle';
import {
  setUserName,
  updateApprovedStatus,
  updateFirstName,
  updateLastName,
} from 'apiHelper/ApiHandlers/usersApi';

const ORGUserCard = ({
  FirstName,
  LastName,
  FullName,
  UserName,
  ImageURL,
  UserID,
  LastActivityTime_Local,
  IsApproved,
}) => {
  const [isApprovedStatus, setIsApprovedStatus] = useState(IsApproved);
  const [firstName, setFirstName] = useState(FirstName);
  const [lastName, setLastName] = useState(LastName);
  const userTitle = useCallback(
    (editable, column = false) => (
      <UserFullNameTitle
        ImageURL={ImageURL}
        FullName={FullName}
        column={column}
        editable={editable}>
        <EditableTitle
          value={firstName}
          onConfirm={(e) => handleFirstNameUpdate(e)}></EditableTitle>
        <EditableTitle
          value={lastName}
          onConfirm={(e) => handleLastNameUpdate(e)}></EditableTitle>
      </UserFullNameTitle>
    ),
    [FullName, ImageURL, firstName, lastName]
  );

  const updateUserName = async (value) => {
    if (value !== UserName) {
      const result = await setUserName(value, UserID);
      if (result?.Succeed) {
        InfoToast({
          type: 'success',
          autoClose: true,
          message: `نام کاربری با موفقیت ثبت شد.`,
        });
      }
    }
  };

  const handleFirstNameUpdate = (firstName) => {
    console.log(firstName);
    updateFirstName(UserID, firstName)
      .then((res) => {
        console.log(res);
        setFirstName(firstName);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLastNameUpdate = (lastName) => {
    updateLastName(UserID, lastName)
      .then((res) => {
        console.log(res);
        setLastName(lastName);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleApprovedStatus = (value) => {
    setIsApprovedStatus(value);
    updateApprovedStatus(value, UserID)
      .then((res) => {
        console.log('end', res);
        if (res?.Succeed) {
          InfoToast({
            type: 'info',
            autoClose: true,
            message: `عملیات موفقیت آمیز بود.`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Styled.ListBodyItem width={25}>{userTitle(true)}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={25}>
        <InlineEditableTitle onChange={updateUserName}>
          {UserName}
        </InlineEditableTitle>
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={20}>
        {LastActivityTime_Local}
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={10}>
        <UserGroupEdit />
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={10}>
        <ResetPassword render={userTitle(false, true)} userId={UserID} />
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={10}>
        <ToggleButton
          value={isApprovedStatus}
          onToggle={toggleApprovedStatus}
        />
      </Styled.ListBodyItem>
    </>
  );
};
export default ORGUserCard;

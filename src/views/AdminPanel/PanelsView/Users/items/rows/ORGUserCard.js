import * as Styled from '../UsersListStyled';
import UserFullNameTitle from './UserFullNameTitle';
import ResetPassword from './ResetPassword';
import { useCallback, useState } from 'react';
import InlineEditableTitle from './InlineEditableTitle';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import EditableTitle from './EditableTitle';
import {
  setUserName,
  updateApprovedStatus,
  updateFirstName,
  updateLastName,
} from 'apiHelper/ApiHandlers/usersApi';
import useWindowContext from 'hooks/useWindowContext';

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
  const { RVDic } = useWindowContext();
  const userTitle = useCallback(
    (editable, column = false) => (
      <UserFullNameTitle
        ImageURL={ImageURL}
        FullName={FullName}
        column={column}
        editable={editable}
      >
        <EditableTitle
          value={firstName}
          onConfirm={(e) => handleFirstNameUpdate(e)}
        />
        <EditableTitle
          value={lastName}
          onConfirm={(e) => handleLastNameUpdate(e)}
        />
      </UserFullNameTitle>
    ),
    [FullName, ImageURL, firstName, lastName]
  );

  const updateUserName = async (value) => {
    if (value !== UserName) {
      const { Succeed } = await setUserName(value, UserID);
      if (Succeed) {
        InfoToast({
          type: 'success',
          autoClose: true,
          message: RVDic?.MSG[Succeed] || Succeed,
        });
      }
    }
  };

  const handleFirstNameUpdate = async (firstName) => {
    await updateFirstName(UserID, firstName);
    setFirstName(firstName);
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

  const toggleApprovedStatus = async (value) => {
    setIsApprovedStatus(value);
    const { Succeed, ErrorText } = await updateApprovedStatus(value, UserID);
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

      <Styled.ListBodyItem width={15}>
        <ResetPassword
          render={userTitle(false, true)}
          userId={UserID}
          userTitle={FullName}
        />
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={15}>
        <ToggleButton
          value={isApprovedStatus}
          onToggle={toggleApprovedStatus}
        />
      </Styled.ListBodyItem>
    </>
  );
};
export default ORGUserCard;

import * as Styled from '../ListStyled';
import UserFullNameTitle from './UserFullNameTitle';
import ResetPassword from './ResetPassword';
import { useMemo, useState } from 'react';
import InlineEditableTitle from './InlineEditableTitle';
import {
  setRandomPassword,
  setUserName,
  updateApprovedStatus,
} from '../../api';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import ToggleButton from '../../../../../../components/Buttons/Toggle/Toggle';
import UserGroupEdit from './UserGroupEdit';

const ORGUserCard = ({
  FirstName,
  LastName,
  FullName,
  UserName,
  ImageURL,
  UserID,
  LastActivityTime_Local,
  IsApproved,
  ...props
}) => {
  const userTitle = useMemo(
    () => (
      <UserFullNameTitle
        ImageURL={ImageURL}
        FullName={FullName}
        column={false}
      />
    ),
    [FullName, ImageURL]
  );
  const [isApprovedStatus, setIsApprovedStatus] = useState(IsApproved);

  const updateUserName = async (value) => {
    if (value !== UserName) {
      const result = await setUserName(value, UserID);
      if (result?.Succeed) {
        InfoToast({
          type: 'info',
          autoClose: true,
          message: `نام کاربری با موفقیت ثبت شد.`,
        });
      }
    }
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

  const handleResetPassword = () => {
    setRandomPassword(UserID)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Styled.ListBodyItem width={25}>{userTitle}</Styled.ListBodyItem>

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
        <ResetPassword
          render={userTitle}
          onResetPasswordConfirm={handleResetPassword}
        />
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

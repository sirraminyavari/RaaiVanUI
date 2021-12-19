import styled from 'styled-components';
import * as Styled from '../UsersListStyled';
import UserFullNameTitle from './UserFullNameTitle';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import UserDeleteButton from './UserDeleteButton';
import UserGroupEdit from './UserGroupEdit';
import { useMemo, useState } from 'react';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { addSystemAdmin, removeSystemAdmin } from 'apiHelper/ApiHandlers/RVApi';
const TeamBasedUserCard = ({
  ImageURL,
  FullName,
  Email,
  IsSystemAdmin,
  lastTime,
  lastDate,
  MainEmailAddress,
  LastActivityTime_Local,
  UserID,
  groups,
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

  const [IsAdmin, setIsAdmin] = useState(IsSystemAdmin);

  const handleSystemAdminChange = (value) => {
    setIsAdmin(value);
    if (value) {
      addSystemAdmin(UserID)
        .then((res) => {
          if (res?.ErrorText) {
            setIsAdmin(!value);
            InfoToast({
              type: 'error',
              autoClose: true,
              message: `خطایی رخ داد.`,
            });
          } else if (res?.Succeed) {
            InfoToast({
              type: 'info',
              autoClose: true,
              message: `عملیات موفقیت آمیز بود.`,
            });
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      removeSystemAdmin(UserID)
        .then((res) => {
          if (res?.ErrorText) {
            setIsAdmin(!value);
            InfoToast({
              type: 'error',
              autoClose: true,
              message: `خطایی رخ داد.`,
            });
          } else if (res?.Succeed) {
            InfoToast({
              type: 'info',
              autoClose: true,
              message: `عملیات موفقیت آمیز بود.`,
            });
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleRemoveUser = () => {
    removeSystemAdmin(UserID)
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

      <Styled.ListBodyItem width={25}>{MainEmailAddress}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={17}>
        <DateTimeContainer>{LastActivityTime_Local}</DateTimeContainer>
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={8}>
        <ToggleWrapper>
          <ToggleButton value={IsAdmin} onToggle={handleSystemAdminChange} />
        </ToggleWrapper>
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={8}>
        <UserGroupEdit UserID={UserID} Name={FullName} Groups={groups} />
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={17}>
        <UserDeleteButton render={userTitle} onRemoveConfirm={handleRemoveUser}>
          {'حذف از تیم'}
        </UserDeleteButton>
      </Styled.ListBodyItem>
    </>
  );
};

const DateTimeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`;

const Toggle = styled(ToggleButton)`
  width: 50px !important;
`;
const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center !important;
  align-items: center;
`;
export default TeamBasedUserCard;

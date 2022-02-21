import UserFullNameTitle from './UserFullNameTitle';
import * as Styled from '../UsersListStyled';
import ResendInvitationButton from './ResendInvitationButton';
import styled from 'styled-components';
import { useMemo } from 'react';
import useWindowContext from 'hooks/useWindowContext';
import { inviteUsersBatch } from 'apiHelper/ApiHandlers/usersApi';
import InfoToast from 'components/toasts/info-toast/InfoToast';

const InvitedUserRow = ({
  ApplicationID,
  ReceiverFirstName,
  ReceiverLastName,
  Email,
  SendDate,
  invitationTime,
  ...props
}) => {
  const { RVDic, RV_RTL } = useWindowContext();
  const userTitle = useMemo(
    () => (
      <UserFullNameTitle
        FullName={`${ReceiverFirstName} ${ReceiverLastName}`}
        column={false}
      />
    ),
    []
  );

  const resendInvitation = async () => {
    const Users = [
      {
        Email,
        FullName: `${ReceiverFirstName} ${ReceiverLastName}`,
      },
    ];
    const { ErrorText, Succeed } = await inviteUsersBatch({
      ApplicationID,
      Users,
    });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic.MSG[ErrorText] || ErrorText,
        position: RV_RTL ? 'bottom-left' : 'bottom-right',
      });
    } else if (Succeed) {
      InfoToast({
        type: 'success',
        autoClose: true,
        message: RVDic.MSG[Succeed] || Succeed,
        position: RV_RTL ? 'bottom-left' : 'bottom-right',
      });
    }
  };

  return (
    <>
      <Styled.ListBodyItem width={25}>{userTitle}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={25}>{Email}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={33}>
        <DateTimeContainer>
          <DateTimeItem>{SendDate}</DateTimeItem>
        </DateTimeContainer>
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={17}>
        <ResendInvitationButton onClick={resendInvitation}>
          {RVDic?.ReInvite}
        </ResendInvitationButton>
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
const DateTimeItem = styled.div``;
export default InvitedUserRow;

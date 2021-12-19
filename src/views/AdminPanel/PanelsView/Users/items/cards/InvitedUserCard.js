import UserFullNameTitle from './UserFullNameTitle';
import * as Styled from '../UsersListStyled';
import ResendInvitationButton from './ResendInvitationButton';
import styled from 'styled-components';
import { useMemo } from 'react';

const InvitedUserCard = ({
  ReceiverFirstName,
  ReceiverLastName,
  Email,
  SendDate,
  invitationTime,
  ...props
}) => {
  const userTitle = useMemo(
    () => (
      <UserFullNameTitle
        FullName={`${ReceiverFirstName} ${ReceiverLastName}`}
        column={false}
      />
    ),
    []
  );
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
        <ResendInvitationButton>دعوت مجدد</ResendInvitationButton>
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
export default InvitedUserCard;

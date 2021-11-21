import UserFullNameTitle from './UserFullNameTitle';
import * as Styled from '../ListStyled';
import ResendInvitationButton from './ResendInvitationButton';
import styled from 'styled-components';

const InvitedUserCard = ({
  Name,
  Email,
  invitationDate,
  invitationTime,
  ...props
}) => {
  const userTitle = <UserFullNameTitle Name={Name} />;
  return (
    <>
      <Styled.ListBodyItem width={25}>{userTitle}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={25}>{Email}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={33}>
        <DateTimeContainer>
          <DateTimeItem>{invitationTime}</DateTimeItem>
          <DateTimeItem>{invitationDate}</DateTimeItem>
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

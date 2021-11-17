import styled from 'styled-components';
import * as Styled from '../ListStyled';
import UserFullNameTitle from './UserFullNameTitle';
import ToggleButton from '../../../../../../components/Buttons/Toggle/Toggle';
import UserDeleteButton from './UserDeleteButton';
import UserGroupEdit from './UserGroupEdit';
const TeamBasedUserCard = ({
  ProfileUrl,
  Name,
  Email,
  IsAdmin,
  lastTime,
  lastDate,
  ...props
}) => {
  const userTitle = <UserFullNameTitle ProfileUrl={ProfileUrl} Name={Name} />;

  return (
    <>
      <Styled.ListBodyItem width={25}>{userTitle}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={25}>{Email}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={17}>
        <DateTimeContainer>
          <DateTimeItem>{lastTime}</DateTimeItem>
          <DateTimeItem>{lastDate}</DateTimeItem>
        </DateTimeContainer>
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={8}>
        <ToggleButton value={IsAdmin} />
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={8}>
        <UserGroupEdit IsAdmin={IsAdmin} Name={Name} />
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={17}>
        <UserDeleteButton render={userTitle}>{'حذف از تیم'}</UserDeleteButton>
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
export default TeamBasedUserCard;

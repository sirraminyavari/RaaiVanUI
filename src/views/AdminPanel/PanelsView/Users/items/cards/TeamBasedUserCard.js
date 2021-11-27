import styled from 'styled-components';
import * as Styled from '../ListStyled';
import UserFullNameTitle from './UserFullNameTitle';
import ToggleButton from 'components/Toggle/Toggle';
import UserDeleteButton from './UserDeleteButton';
import UserGroupEdit from './UserGroupEdit';
import { useMemo } from 'react';
const TeamBasedUserCard = ({
  ImageURL,
  FullName,
  Email,
  IsAdmin,
  lastTime,
  lastDate,
  MainEmailAddress,
  LastActivityTime_Local,
  ...props
}) => {
  console.log(FullName, ImageURL);
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

  return (
    <>
      <Styled.ListBodyItem width={25}>{userTitle}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={25}>{MainEmailAddress}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={17}>
        <DateTimeContainer>{LastActivityTime_Local}</DateTimeContainer>
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={8}>
        <ToggleButton value={IsAdmin} />
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={8}>
        <UserGroupEdit IsAdmin={IsAdmin} Name={FullName} />
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

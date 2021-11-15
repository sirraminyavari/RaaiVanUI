import styled from 'styled-components';
import * as Styled from '../ListStyled';
import UserFullNameTitle from './UserFullNameTitle';
import ToggleButton from '../../../../../../components/Buttons/Toggle/Toggle';
import UserDeleteButton from './UserDeleteButton';
const TeamBasedUserCard = ({ ProfileUrl, Name, Email, IsAdmin, ...props }) => {
  const userTitle = <UserFullNameTitle ProfileUrl={ProfileUrl} Name={Name} />;
  return (
    <>
      <Styled.ListBodyItem width={25}>{userTitle}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={25}>{Email}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={17}></Styled.ListBodyItem>

      <Styled.ListBodyItem width={8}>
        <ToggleButton value={IsAdmin} />
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={8}>....</Styled.ListBodyItem>

      <Styled.ListBodyItem width={17}>
        <UserDeleteButton render={userTitle}>{'حذف از تیم'}</UserDeleteButton>
      </Styled.ListBodyItem>
    </>
  );
};
export default TeamBasedUserCard;

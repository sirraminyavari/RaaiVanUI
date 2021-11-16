import UserFullNameTitle from './UserFullNameTitle';
import * as Styled from '../ListStyled';

const InvitedUserCard = ({ Name, Email, ...props }) => {
  const userTitle = <UserFullNameTitle Name={Name} />;
  return (
    <>
      <Styled.ListBodyItem width={25}>{userTitle}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={25}>{Email}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={33}></Styled.ListBodyItem>

      <Styled.ListBodyItem width={17}></Styled.ListBodyItem>
    </>
  );
};
export default InvitedUserCard;

import * as Styled from '../UserGroupsStyles';
import useWindowContext from 'hooks/useWindowContext';

const UserGroupMembers = ({ members }) => {
  const { RV_RTL } = useWindowContext();
  return (
    <Styled.GroupMemberContainer>
      {members.map((x, index) => (
        <Styled.GroupMemberItem
          index={index}
          rtl={RV_RTL}
          key={x?.UserID}
          src={x?.ImageURL}
        />
      ))}
    </Styled.GroupMemberContainer>
  );
};
export default UserGroupMembers;

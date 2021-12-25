import styled from 'styled-components';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import useWindowContext from 'hooks/useWindowContext';
import { useContext, useState } from 'react';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { PermissionContext } from '../Permissions';
import RoleItem from './RoleItem';
import * as Styled from '../PermissionStyle';
import { getChildNodes, getNodeTypes } from '../../api';
import UserSelectModal from './UserSelectModal';
import GroupSelectModal from './GroupSelectModal';

const RoleSelectionPane = ({ ...props }) => {
  const { RV_RTL } = useWindowContext();
  const { roles } = useContext(PermissionContext);
  const [userType, setUserType] = useState(true);
  const [roleSearchText, setRoleSearchText] = useState('');

  const roleType = (type) => {
    return (
      roles
        ?.filter((x) => x?.RoleType === type)
        ?.filter((x) => x?.RoleName.includes(roleSearchText))
        ?.map((x) => {
          const { RoleID } = x;

          return <RoleItem key={RoleID} {...x} />;
        }) || []
    );
  };

  return (
    <>
      <RoleSelectionRow rtl={RV_RTL}>
        <RoleSelectionButton
          selected={userType}
          onClick={() => setUserType(true)}>
          {'کاربرها'}
        </RoleSelectionButton>

        <RoleSelectionButton
          selected={!userType}
          onClick={() => setUserType(false)}>
          {'گروه‌های کاربری'}
        </RoleSelectionButton>

        <AddRoleContainer>
          {userType && <UserSelectModal />}

          {!userType && <GroupSelectModal />}
        </AddRoleContainer>
      </RoleSelectionRow>

      <RolesContainer>
        <Styled.RoleSearchBox>
          <Styled.RoleInput
            type="text"
            value={roleSearchText}
            onChange={(e) => setRoleSearchText(e?.target?.value)}
          />
          <SearchIcon size={20} />
        </Styled.RoleSearchBox>

        <ItemContainer>
          {userType && roleType('User')}

          {!userType && roleType('Node')}
        </ItemContainer>
      </RolesContainer>
    </>
  );
};

const RoleSelectionRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: ${(props) => (props?.rtl ? 'row' : 'row-reverse')};
  justify-content: center;
  height: 3.5rem;
  border-bottom: 1px solid ${CV_DISTANT};
  padding: 0 1rem;
  gap: 0.5rem;
`;
const RoleSelectionButton = styled.div`
  height: 3.5rem;
  line-height: 3.5rem;
  cursor: pointer;
  user-select: none;
  color: ${(props) => (props?.selected ? TCV_DEFAULT : CV_DISTANT)};
  ${(props) => props?.selected && `border-bottom: 3px solid ${TCV_DEFAULT}`};
  font-weight: 500;
  font-size: 1rem;
  padding: 0 1rem;
`;

const AddRoleContainer = styled.div`
  height: 3.5rem;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const RolesContainer = styled.div`
  padding: 1rem;
`;

const ItemContainer = styled.div`
  overflow: auto;
  width: 100%;
  margin: 0.75rem 0;
`;
export default RoleSelectionPane;

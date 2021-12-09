import styled from 'styled-components';
import { CV_DISTANT, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import useWindowContext from 'hooks/useWindowContext';
import { useContext, useState } from 'react';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { PermissionContext } from '../Permissions';
import RoleItem from './RoleItem';

const RoleSelectionPane = ({ ...props }) => {
  const { RV_RTL } = useWindowContext();
  const { roles } = useContext(PermissionContext);
  const [userType, setUserType] = useState(true);
  const [roleSearchText, setRoleSearchText] = useState('');

  const userRoles =
    roles
      ?.filter((x) => x?.RoleType === 'User')
      ?.filter((x) => x?.RoleName.includes(roleSearchText))
      ?.map((x) => {
        const { RoleID } = x;

        return <RoleItem key={RoleID} {...x} />;
      }) || [];

  const nodeRoles =
    roles
      ?.filter((x) => x?.RoleType === 'Node')
      ?.filter((x) => x?.RoleName.includes(roleSearchText))
      ?.map((x) => {
        const { RoleID } = x;

        return <RoleItem key={RoleID} {...x} />;
      }) || [];

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

        <AddRoleContainer></AddRoleContainer>
      </RoleSelectionRow>

      <RolesContainer>
        <RoleSearchBox>
          <RoleInput
            type="text"
            value={roleSearchText}
            onChange={(e) => setRoleSearchText(e?.target?.value)}
          />
          <SearchIcon size={20} />
        </RoleSearchBox>

        <ItemContainer>
          {userType && userRoles}

          {!userType && nodeRoles}
        </ItemContainer>
      </RolesContainer>
    </>
  );
};

export const RoleSelectionRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: ${(props) => (props?.rtl ? 'row' : 'row-reverse')};
  justify-content: center;
  height: 3.5rem;
  border-bottom: 1px solid ${CV_DISTANT};
  padding: 0 1rem;
  gap: 0.5rem;
`;
export const RoleSelectionButton = styled.div`
  height: 3.5rem;
  line-height: 3.5rem;
  cursor: pointer;
  user-select: none;
  color: ${(props) => (props?.selected ? TCV_DEFAULT : CV_DISTANT)};
  ${(props) => props?.selected && `border-bottom: 3px solid ${TCV_DEFAULT}`};
  font-weight: 600;
  font-size: 1rem;
  padding: 0 1rem;
`;

export const AddRoleContainer = styled.div`
  height: 3.5rem;
  display: flex;
  flex: 1;
`;

const RolesContainer = styled.div`
  padding: 1rem;
`;

const RoleSearchBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  background-color: ${CV_WHITE};
  border-radius: 0.625rem;
  padding: 0 0.75rem;
  color: ${CV_DISTANT};
  border: 1px solid ${CV_DISTANT};
`;

const RoleInput = styled.input`
  outline: none;
  border: none;
  flex: 1;

  &::placeholder {
    color: ${CV_DISTANT};
    font-size: 0.8rem;
    font-weight: 500;
  }
`;
const ItemContainer = styled.div`
  overflow: auto;
  width: 100%;
  margin: 0.75rem 0;
`;
export default RoleSelectionPane;

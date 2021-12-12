import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_LIGHT,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import useWindowContext from 'hooks/useWindowContext';
import { useContext, useState, useEffect } from 'react';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { PermissionContext } from '../Permissions';
import RoleItem from './RoleItem';
import * as Styled from '../PermissionStyle';
import AddRoleModal from './AddRoleModal';
import SearchInput from '../../../Users/items/SearchInput';
import { getNodeTypes, getUsers } from '../../api';
import UserRoleItemToSelect from './UserRoleItemToSelect';

const RoleSelectionPane = ({ ...props }) => {
  const { RV_RTL } = useWindowContext();
  const { roles, setRoles } = useContext(PermissionContext);
  const [userType, setUserType] = useState(true);
  const [roleSearchText, setRoleSearchText] = useState('');
  const [searchNewRole, setSearchNewRole] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

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

  useEffect(() => {
    if (userType) {
      loadUsers();
    } else {
      loadGroups();
    }

    loadGroups();
  }, [searchNewRole]);

  const loadUsers = () => {
    getUsers(searchNewRole).then((res) => {
      setUsers(res);
      console.log(res);
    });
  };

  const loadGroups = () => {
    getNodeTypes().then((res) => {
      console.log(res);
    });
  };

  const handleUserSelect = (user) => {
    const exist = selectedUsers.find((x) => x.UserID === user.UserID);
    if (!exist) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(selectedUsers.filter((x) => x.UserID === user.UserID));
    }
  };

  const handleModalClose = () => {
    setSelectedUsers([]);
  };

  const handleModalConfirm = () => {
    if (userType) {
      const mappedToRoles = selectedUsers.map((x) => ({
        RoleID: x?.UserID,
        AdditionalID: x?.UserName,
        IconURL: x?.ImageURL,
        RoleName: x?.FullName,
        RoleType: 'User',
        Permissions: 0,
      }));

      mappedToRoles.forEach((role) => {
        const exist = roles.find((x) => x.RoleID === role.RoleID);
        if (!exist) {
          roles.push(role);
        }
      });
    }

    setSelectedUsers([]);
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
          <AddRoleModal
            onClose={handleModalClose}
            onConfirm={handleModalConfirm}>
            <SearchRoleInput>
              <CustomRole
                type="text"
                delayTime={1000}
                defaultValue={searchNewRole}
                onChange={(value) => setSearchNewRole(value)}
                placeholder={'برای افزودن کاربر، نام کاربر را جستجو کنید...'}
              />
              <SearchIcon size={20} />
            </SearchRoleInput>

            <ModalRoleSelectionContainer>
              {userType &&
                users.map((x) => (
                  <UserRoleItemToSelect
                    key={x.UserID}
                    {...x}
                    onClick={(e) => handleUserSelect(x)}
                  />
                ))}
            </ModalRoleSelectionContainer>
          </AddRoleModal>
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

const SearchRoleInput = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${CV_DISTANT};
  border-radius: 0.5rem;
  margin-bottom: 0.625rem;
  overflow: hidden;
  color: ${CV_DISTANT};
  padding: 0.75rem;
`;
const ModalRoleSelectionContainer = styled.div`
  background-color: ${CV_GRAY_LIGHT};
  padding: 0.5rem;
  border-raduis: 0.5rem;
  margin-bottom: 1.5rem;
  height: 25rem;
  overflow: hidden;
`;
const CustomRole = styled(SearchInput)`
  border: none !important;
  outline: none !important;
  width: 100%;
`;
export default RoleSelectionPane;

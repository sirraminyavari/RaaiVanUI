import { useContext, useEffect, useState } from 'react';
import Modal from 'components/Modal/Modal';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import Button from 'components/Buttons/Button';
import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_LIGHT,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import UserRoleItemToSelect from './UserRoleItemToSelect';
import SearchInput from '../../../Users/items/SearchInput';
import { getUsers } from '../../api';
import { PermissionContext } from '../Permissions';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useWindowContext from 'hooks/useWindowContext';

const UserSelectModal = () => {
  const { RVDic } = useWindowContext();
  const { roles, setRoles } = useContext(PermissionContext);
  const [modalInfo, setModalInfo] = useState({
    title: RVDic.SelectN.replace('[n]', RVDic.User),
    contentWidth: '30%',
    middle: true,
    show: false,
    titleClass: 'rv-default',
    titleContainerClass: 'modal-title-bar',
  });
  const [searchNewRole, setSearchNewRole] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const loadUsers = () => {
    getUsers(searchNewRole, true).then((res) => {
      setUsers(res);
    });
  };

  useEffect(() => {
    loadUsers();
  }, [searchNewRole]);

  const handleUserSelect = (user) => {
    const exist = selectedUsers.find((x) => x.UserID === user.UserID);
    if (!exist) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(selectedUsers.filter((x) => x.UserID === user.UserID));
    }
  };

  const onModalCancel = () => {
    setSelectedUsers([]);
    setModalInfo({ ...modalInfo, show: false });
  };

  const onModalConfirm = () => {
    const mappedToRoles = selectedUsers.map((x) => ({
      RoleID: x?.UserID,
      AdditionalID: x?.UserName,
      IconURL: x?.ImageURL,
      RoleName: x?.FullName,
      RoleType: 'User',
      Permissions: 0,
    }));

    const nextRoles = [...roles];
    mappedToRoles.forEach((role) => {
      const exist = roles.find((x) => x.RoleID === role.RoleID);
      if (!exist) {
        nextRoles.push(role);
      }
    });
    setRoles(nextRoles);
    setSelectedUsers([]);
    setModalInfo({ ...modalInfo, show: false });
  };
  return (
    <DialogContainer>
      <ModalButton onClick={(e) => setModalInfo({ ...modalInfo, show: true })}>
        <AddIcon circleOutline={true} size={20} />
        <div>{RVDic.Add}</div>
      </ModalButton>
      <Modal {...modalInfo} onClose={onModalCancel}>
        <SearchRoleInput>
          <CustomRole
            type="text"
            delayTime={1000}
            defaultValue={searchNewRole}
            onChange={(value) => setSearchNewRole(value)}
            placeholder={RVDic.Search}
          />
          <SearchIcon size={20} />
        </SearchRoleInput>

        <ModalRoleSelectionContainer>
          <PerfectScrollbar>
            {users.map((x) => (
              <UserRoleItemToSelect
                key={x.UserID}
                {...x}
                onClick={(e) => handleUserSelect(x)}
              />
            ))}
          </PerfectScrollbar>
        </ModalRoleSelectionContainer>

        <ActionButtonContainer>
          <Button type="primary" style={buttonStyles} onClick={onModalConfirm}>
            {RVDic.Save}
          </Button>

          <Button
            type="negative-o"
            style={buttonStyles}
            onClick={onModalCancel}>
            {RVDic.Return}
          </Button>
        </ActionButtonContainer>
      </Modal>
    </DialogContainer>
  );
};
const DialogContainer = styled.div``;
const ModalButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  height: 2rem;
  width: 7.5rem;
  border-radius: 1rem;
  background-color: ${TCV_DEFAULT};
  color: ${CV_WHITE};
  cursor: pointer;
  user-select: none;
`;

const ModalMessage = styled.div`
  height: 1.4rem;
  line-height: 1.4rem;
  color: ${CV_GRAY};
  margin: 1.8rem 0 1.5rem 0;
`;
const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
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
  overflow: auto;
`;
const CustomRole = styled(SearchInput)`
  border: none !important;
  outline: none !important;
  width: 100%;
`;
const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};
export default UserSelectModal;

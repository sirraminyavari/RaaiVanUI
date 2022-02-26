import { Container } from './SelectObjectStyle';
import SelectObjectDropDown from './SelectObjectDropDown';
import { useState } from 'react';
import Modal from 'components/Modal/Modal';
import UserGroupUpsertModal from 'components/UserManagement/CreateUserGroupModal/UserGroupUpsertModal';
import { usePrivacyProvider } from '../PrivacyContext';

const SelectObject = ({ type }) => {
  const { RVDic } = window;
  const [searchText, setSearchText] = useState('');
  const { users } = usePrivacyProvider();
  const [info, setInfo] = useState({
    modalType: '',
    show: false,
    title: '',
    contentWidth: '34rem',
    titleClass: 'rv-default',
    titleContainerClass: 'modal-title-bar',
  });

  const handleUserSearch = (e) => {
    console.log(e);
    setSearchText(e?.target?.value);
  };

  const onNewGroupModalOpen = () => {
    setInfo({
      ...info,
      modalType: 'create-new-group',
      title: RVDic?.CreateNewN.replace('[n]', RVDic.Group),
      show: true,
    });
  };

  const onGroupModalOpen = () => {
    setInfo({ ...info, modalType: 'group-select', show: true });
  };

  const onUserModalOpen = () => {
    setInfo({ ...info, modalType: 'user-select', show: true });
  };

  const onCancel = () => {
    setInfo({ ...info, modalType: '', show: false });
  };

  const createNewGroup = async (title, members) => {
    console.log(title, members);
  };

  return (
    <Container>
      <SelectObjectDropDown
        {...{
          type,
          onNewGroupModalOpen,
          onGroupModalOpen,
          onUserModalOpen,
          searchText,
          handleUserSearch,
        }}
      />

      <Modal {...info} onClose={onCancel}>
        <UserGroupUpsertModal
          {...{ users, onCancel, onConfirm: createNewGroup }}
        />
      </Modal>
    </Container>
  );
};
export default SelectObject;

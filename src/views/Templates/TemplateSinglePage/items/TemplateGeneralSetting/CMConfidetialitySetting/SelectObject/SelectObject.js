import { Container } from './SelectObjectStyle';
import SelectObjectDropDown from './SelectObjectDropDown';
import { useState } from 'react';
import Modal from 'components/Modal/Modal';
import UserGroupUpsertModal from 'components/UserManagement/CreateUserGroupModal/UserGroupUpsertModal';
import { usePrivacyProvider } from '../PrivacyContext';
import SelectUsers from './SelectObjectItem/SelectUsers';
import SearchInput from 'components/Inputs/SearchInput';

const SelectObject = ({ type }) => {
  const { RVDic } = window;
  const [searchText, setSearchText] = useState('test');
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
    setInfo({
      ...info,
      modalType: 'group-select',
      title: RVDic.SelectN.replace('[n]', RVDic.Group),
      show: true,
    });
  };

  const onUserModalOpen = () => {
    setInfo({
      ...info,
      modalType: 'user-select',
      title: RVDic.SelectN.replace('[n]', RVDic.User),
      show: true,
    });
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
        {info?.modalType === 'create-new-group' && (
          <UserGroupUpsertModal
            {...{ users, onCancel, onConfirm: createNewGroup }}
          />
        )}

        {info?.modalType === 'user-select' && (
          <>
            <SearchInput value={searchText} onChange={handleUserSearch} />
            <SelectUsers {...{ type, searchText }} />
            div
          </>
        )}
      </Modal>
    </Container>
  );
};
export default SelectObject;

import UserSelect from './items/UserSelect';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import ResizeIcon from 'components/Icons/ResizeIcon/ResizeIcon';
import { TabView } from 'components/TabView/TabView';
import { useState, createContext, FC, useRef, useEffect } from 'react';
import * as Styles from './UserGroupSelectStyles';
import GroupSelect from './items/GroupSelect';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import { BsPlusCircle } from 'react-icons/bs';
import Modal from 'components/Modal/Modal';
import UserGroupUpsertModal from '../CreateUserGroupModal/UserGroupUpsertModal';
import api from 'apiHelper';
import InfoToast from 'components/toasts/info-toast/InfoToast';

interface IUserStateChangeProps {
  user: ISelectedObject;
  state: boolean;
}

interface IGroupStateChangeProps {
  group: ISelectedObject;
  state: boolean;
}

interface ICloseProps {
  users?: Array<any>;
  groups?: Array<any>;
}

export interface ISelectedObject {
  id: string;
  title: string;
  src: string;
}

export interface IUserGroupSelect {
  selectedUsers: Array<string>;
  selectedGroups: Array<string>;
  selectUserEnabled: boolean;
  selectGroupEnabled: boolean;
  expnadable: boolean;
  typeId: string;
  onUserStateChange: (props: IUserStateChangeProps) => void;
  onGroupStateChange: (props: IGroupStateChangeProps) => void;
  onUserSearchTextChange?: (keyword: string) => void;
  onClose: (props: ICloseProps) => void;
}

interface IUserGroupSelectContextVlue {
  users?: Array<any>;
  groups?: Array<any>;
  onUserSearchTextChange?: (keyword: string) => void;
  handleUserCheck?: (value: ISelectedObject, state: boolean) => void;
  handleGroupCheck?: (value: ISelectedObject, state: boolean) => void;
  selectedUsers?: Array<string>;
  selectedGroups?: Array<string>;
}

export const UserGroupSelectContext =
  createContext<IUserGroupSelectContextVlue>({});

const UserGroupSelect: FC<IUserGroupSelect> = (props) => {
  const {
    selectedGroups: _selectedGroups,
    selectedUsers: _selectedUsers,
    typeId,
    selectUserEnabled = true,
    selectGroupEnabled = true,
    onGroupStateChange,
    onUserStateChange,
    onUserSearchTextChange,
    expnadable = false,
    onClose,
  } = props;

  const { RVDic, RV_RTL: rtl } = window;
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState<Array<any>>([]);
  const [selectedUsers, setSelectedUsers] = useState(_selectedUsers || []);
  const [selectedGroups, setSelectedGroups] = useState(_selectedGroups || []);
  const dropDownEl = useRef(null);
  const [info, setInfo] = useState({
    modalType: '',
    show: false,
    title: '',
    contentWidth: '34rem',
    titleClass: 'rv-default',
    titleContainerClass: 'modal-title-bar',
  });

  const fetchData = async () => {
    if (selectUserEnabled) {
      const users = await api?.Users?.getUsers({ IsApproved: true });
      setUsers(users);
    }
    if (selectGroupEnabled) {
      const groups = await api?.CN?.getGroupsAll();
      setGroups(groups);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const open = () => setIsOpen(true);

  const close = () => {
    setIsOpen(false);
    onClose && onClose({ users: selectedUsers, groups: selectedGroups });
  };

  const handleUserCheck = (value: any, state: boolean) => {
    if (state) {
      setSelectedUsers([...selectedUsers, value?.id]);
    } else {
      const _selUsers = selectedUsers?.filter((x) => x !== value?.id);
      setSelectedUsers(_selUsers);
    }
    onUserStateChange && onUserStateChange({ state, user: value });
  };

  const handleGroupCheck = (value: any, state: boolean) => {
    if (state) {
      setSelectedGroups([...selectedGroups, value]);
    } else {
      const _selGroups = selectedGroups?.filter((x) => x !== value);
      setSelectedGroups(_selGroups);
    }
    onGroupStateChange && onGroupStateChange({ state, group: value });
  };

  const onCancel = () => {
    setInfo({ ...info, modalType: '', show: false });
  };

  const openNewGroupDialog = () => {
    setInfo({ ...info, modalType: 'create-new-group', show: true });
  };

  const createNewGroup = async (title, members) => {
    console.log(title, members);
    const userIds = members?.map((m) => m?.UserID);

    // const res = await api?.CN?.addNode({
    //   Name: title,
    //   NodeTypeID: typeId,
    // });

    // if (res?.Node) {
    //   await api.CN.saveMembers(res?.Node?.NodeID, userIds);
    //   const groups = await api.CN.getGroupsAll();
    // } else {
    // }
  };

  return (
    <UserGroupSelectContext.Provider
      value={{
        users,
        groups,
        onUserSearchTextChange,
        selectedGroups,
        selectedUsers,
        handleGroupCheck,
        handleUserCheck,
      }}
    >
      <Styles.Container>
        <Styles.ToggleButton onClick={open}>
          {'انتخاب اعضا'}
        </Styles.ToggleButton>
        {isOpen && (
          <Styles.DropDown ref={dropDownEl}>
            <TabView>
              {selectUserEnabled && (
                <TabView.Item label={RVDic?.Members} type="Item">
                  <UserSelect />
                </TabView.Item>
              )}

              {selectGroupEnabled && (
                <TabView.Item label={RVDic?.Groups} type="Item">
                  <Styles.AddNewGroupButtonContainer
                    onClick={openNewGroupDialog}
                  >
                    <BsPlusCircle size={20} />
                    <div>{'ساخت گروه کاربری جدید'}</div>
                  </Styles.AddNewGroupButtonContainer>
                  <GroupSelect />
                </TabView.Item>
              )}

              <TabView.Action type="Action">
                {expnadable && (
                  <Styles.ResizeButton>
                    <ResizeIcon size={17} />
                  </Styles.ResizeButton>
                )}

                <Styles.CloseButton onClick={close}>
                  <CloseIcon outline={true} size={22} />
                </Styles.CloseButton>
              </TabView.Action>
            </TabView>
          </Styles.DropDown>
        )}
      </Styles.Container>

      <Modal {...info} onClose={onCancel}>
        {info?.modalType === 'create-new-group' && (
          <UserGroupUpsertModal
            users={users}
            onCancel={onCancel}
            onConfirm={createNewGroup}
          />
        )}
      </Modal>
    </UserGroupSelectContext.Provider>
  );
};
export default UserGroupSelect;

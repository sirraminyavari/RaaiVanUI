import { TabView } from 'components/TabView/TabView';
import { useState, createContext, FC } from 'react';
import * as Styles from './UserGroupSelectStyles';

export interface IUserStateChangeProps {
  user: any;
  state: boolean;
}

export interface IGroupStateChangeProps {
  group: any;
  state: boolean;
}

export interface ICloseProps {
  users?: Array<any>;
  groups?: Array<any>;
}

export interface IUserGroupSelect {
  users: Array<any>;
  selectedUsers: Array<any>;
  groups: Array<any>;
  selectedGroups: Array<any>;
  selectUserEnabled: boolean;
  selectGroupEnabled: boolean;
  expnadable: boolean;
  onUserStateChange: (props: IUserStateChangeProps) => void;
  onGroupStateChange: (props: IGroupStateChangeProps) => void;
  onClose: (props: ICloseProps) => void;
}

export const UserGroupSelectContext = createContext({});

const UserGroupSelect: FC<IUserGroupSelect> = (props) => {
  const {
    users: _users,
    groups: _groups,
    selectedGroups: _selectedUsers,
    selectedUsers: _selectedGroups,
    selectUserEnabled = true,
    selectGroupEnabled = true,
    onGroupStateChange,
    onUserStateChange,
    expnadable = false,
    onClose,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState(_users);
  const [groups, setGroups] = useState(_groups);
  const [selectedUsers, setSelectedUsers] = useState(_selectedUsers);
  const [selectedGrouops, setSelectedGroups] = useState(_selectedGroups);

  const open = () => setIsOpen(true);

  const close = () => {
    setIsOpen(false);
    onClose && onClose({ users: selectedUsers, groups: selectedGrouops });
  };

  return (
    <UserGroupSelectContext.Provider value={{}}>
      <Styles.Container>
        <Styles.ToggleButton onClick={open}>
          {'انتخاب اعضا'}
        </Styles.ToggleButton>
        {isOpen && (
          <Styles.DropDown>
            <TabView>
              {selectUserEnabled && (
                <TabView.Item label={'کابران'} type="Item"></TabView.Item>
              )}

              {selectGroupEnabled && (
                <TabView.Item label={'کابران'} type="Item"></TabView.Item>
              )}
            </TabView>
          </Styles.DropDown>
        )}
      </Styles.Container>
    </UserGroupSelectContext.Provider>
  );
};
export default UserGroupSelect;

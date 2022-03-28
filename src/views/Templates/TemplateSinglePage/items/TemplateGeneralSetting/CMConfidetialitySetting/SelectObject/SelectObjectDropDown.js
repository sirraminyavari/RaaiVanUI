import TabView from 'components/TabView/TabView';
import {
  Button,
  CloseButton,
  DropDown,
  ResizeButton,
  AddNewGroupButtonContainer,
  Input,
  InputContainer,
} from './SelectObjectStyle';
import ResizeIcon from 'components/Icons/ResizeIcon/ResizeIcon';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { createRef, useState } from 'react';
import useOutsideClick from 'hooks/useOutsideClick';
import SelectGroups from './SelectObjectItem/SelectGroups';
import SelectUsers from './SelectObjectItem/SelectUsers';
import { usePrivacyProvider } from '../PrivacyContext';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { useTemplateContext } from '../../../../TemplateProvider';
import { PERMISSION_TYPE } from 'apiHelper/ApiHandlers/privacyApi';
import * as _ from 'lodash';

const SelectObjectDropDown = ({
  type,
  searchText,
  handleUserSearch,
  onNewGroupModalOpen,
  onGroupModalOpen,
  onUserModalOpen,
}) => {
  const { RVDic } = window;
  const [openDropDown, setOpenDropDown] = useState(false);
  const [selectedTab, setSelectedTab] = useState('members');
  const { NodeTypeID } = useTemplateContext();
  const { selectedGroups, selectedUsers, audience, handleAudienceSelection } =
    usePrivacyProvider();
  const dropDownEl = createRef();

  useOutsideClick(() => {
    (async () => {
      // await handleSetAudience();
    })();
  }, dropDownEl);

  const handleSetAudience = async () => {
    setOpenDropDown(false);
    const users = [...selectedUsers].find((x) => x.type === type)?.items;
    const groups = [...selectedGroups].find((x) => x.type === type)?.items;
    let newAudience = [];
    if (type === PERMISSION_TYPE.Modify) {
      [...users, ...groups].forEach((RoleID) => {
        newAudience = newAudience.concat([
          {
            RoleID,
            PermissionType: PERMISSION_TYPE.Modify,
            Allow: true,
          },
          {
            RoleID,
            PermissionType: PERMISSION_TYPE.Delete,
            Allow: true,
          },
        ]);
      });
    } else {
      newAudience = [...users, ...groups].map((RoleID) => ({
        RoleID,
        PermissionType: type,
        Allow: true,
      }));
    }
    const oldAudience = audience?.Items[`${NodeTypeID}`]?.Audience?.map(
      (x) => ({
        RoleID: x?.RoleID,
        PermissionType: x?.PermissionType,
        Allow: x?.Allow,
      })
    );
    let _audience = [...newAudience, ...oldAudience];
    _audience = _.uniqWith(_audience, _.isEqual);
    await handleAudienceSelection(_audience, type);
  };

  const openInDialog = () => {
    if (selectedTab === 'members' && onUserModalOpen) {
      onUserModalOpen();
    }

    if (selectedTab === 'groups' && onGroupModalOpen) {
      onGroupModalOpen();
    }

    setOpenDropDown(false);
  };

  const addNewGroup = () => {
    setOpenDropDown(false);
    if (onNewGroupModalOpen) onNewGroupModalOpen();
  };

  return (
    <>
      <Button onClick={() => setOpenDropDown(true)}>{'انتخاب اعضا'}</Button>
      {openDropDown && (
        <DropDown ref={dropDownEl}>
          <TabView onSelect={(key) => setSelectedTab(key)}>
            <TabView.Item label={'اعضا'} key="members">
              <InputContainer>
                <Input
                  placeholder={RVDic?.Search}
                  value={searchText}
                  onChange={handleUserSearch}
                />
                <SearchIcon size={13} />
              </InputContainer>
              <SelectUsers {...{ type, searchText }} />
            </TabView.Item>

            <TabView.Item label={'گروه‌ها'} key="groups">
              <AddNewGroupButtonContainer onClick={addNewGroup}>
                <PlusIcon size={20} />
                <div>{'ساخت گروه کاربری جدید'}</div>
              </AddNewGroupButtonContainer>
              <SelectGroups {...{ type }} />
            </TabView.Item>

            <TabView.Action>
              <ResizeButton onClick={openInDialog}>
                <ResizeIcon size={17} />
              </ResizeButton>

              <CloseButton onClick={handleSetAudience}>
                <CloseIcon outline={true} size={22} />
              </CloseButton>
            </TabView.Action>
          </TabView>
        </DropDown>
      )}
    </>
  );
};
export default SelectObjectDropDown;

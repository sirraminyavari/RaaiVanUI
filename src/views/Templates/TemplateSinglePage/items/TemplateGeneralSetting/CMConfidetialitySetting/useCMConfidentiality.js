import { useTemplateContext } from '../../../TemplateProvider';
import { createContext, useEffect, useState } from 'react';
import {
  getAudience,
  PERMISSION_TYPE,
  PRIVACY_OBJECT_TYPE,
  setAudience,
} from 'apiHelper/ApiHandlers/privacyApi';
import { getGroupsAll } from '../../../../../../apiHelper/ApiHandlers/CNApi';
import { getUsers } from '../../../../../../apiHelper/ApiHandlers/usersApi';
import produce from 'immer';
import InfoToast from '../../../../../../components/toasts/info-toast/InfoToast';
const accessTypes = [
  { type: 'read', items: [] },
  { type: 'create', items: [] },
  { type: 'modify', items: [] },
];

const basicPermissions = [
  PERMISSION_TYPE.Create,
  PERMISSION_TYPE.Delete,
  PERMISSION_TYPE.Modify,
  PERMISSION_TYPE.View,
];
export const useCMConfidentiality = ({ type }) => {
  const { RVDic } = window;
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const { NodeTypeID } = useTemplateContext();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(accessTypes);
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState(accessTypes);

  useEffect(() => {
    (async () => {
      const audience = await getAudience({ ObjectID: NodeTypeID, Type: type });
      const groups = await getGroupsAll();
      const users = await getUsers({ IsApproved: true });
      setUsers(users);
      setGroups(groups);
      console.log('audience: ', audience);
      setLoading(false);
    })();
  }, []);

  const handleUserSelect = (id, state, type) => {
    if (state) {
      setSelectedUsers(
        produce((d) => {
          const t = d.find((x) => x.type === type);
          t.items.push(id);
        })
      );
    } else {
      setSelectedUsers(
        produce((d) => {
          const t = d.find((x) => x.type === type);
          const g = t.items.filter((x) => x !== id);
          t.items = g;
        })
      );
    }
  };

  const handleGroupSelect = (id, state, type) => {
    if (state) {
      setSelectedGroups(
        produce((d) => {
          const t = d.find((x) => x.type === type);
          t.items.push(id);
        })
      );
    } else {
      setSelectedGroups(
        produce((d) => {
          const t = d.find((x) => x.type === type);
          const g = t.items.filter((x) => x !== id);
          t.items = g;
        })
      );
    }
  };

  const resetAdvancedModeSelectedObjects = () => {
    setSelectedGroups(accessTypes);
    setSelectedUsers(accessTypes);
  };

  const handleSelection = (e) => {
    setSelectedOption(e?.value);
  };

  useEffect(() => {
    (async () => {
      if (selectedOption === 'GRANTED') {
        await setBasicPermission({ DefaultValue: true });
      } else if (selectedOption === 'CLASSIFIED') {
        await setBasicPermission({ DefaultValue: false });
      }
    })();
  }, [selectedOption]);

  const setBasicPermission = async ({ DefaultValue }) => {
    resetAdvancedModeSelectedObjects();
    const Data = {
      [NodeTypeID]: {
        DefaultPermissions: basicPermissions?.map((_type) => ({
          PermissionType: _type,
          DefaultValue,
        })),
      },
    };

    const { ErrorText, Succeed, ...rest } = await setAudience({
      Type: PRIVACY_OBJECT_TYPE.NodeType,
      Data,
    });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
    }
    if (Succeed) {
      InfoToast({
        type: 'success',
        autoClose: true,
        message: RVDic?.MSG[Succeed] || Succeed,
      });
    }
  };

  const setAdvancedPermission = () => {};

  const options = [
    {
      value: 'GRANTED',
      label: 'غیرمحرمانه',
      description: 'دسترسی برای همه کاربران',
    },
    {
      value: 'CLASSIFIED',
      label: 'محرمانه',
      description: 'دسترسی برای مدیران',
    },
    {
      value: 'ADVANCED',
      label: 'محرمانه پیشرفته',
      description: 'دسترسی پیشرفته و قابل شخصی سازی',
    },
  ];

  const advancedOption = [
    {
      key: 1,
      label: 'نمایش آیتم‌ها',
      permissionType: 'read',
    },
    {
      key: 2,
      label: 'ویرایش آیتم‌ها',
      permissionType: 'modify',
    },
    {
      key: 3,
      label: 'ایجاد آیتم جدید',
      permissionType: 'create',
    },
  ];

  return {
    options,
    users,
    groups,
    loading,
    selectedOption,
    handleSelection,
    advancedOption,
    selectedUsers,
    handleUserSelect,
    selectedGroups,
    handleGroupSelect,
  };
};

export default useCMConfidentiality;

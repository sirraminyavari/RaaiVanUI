import { useTemplateContext } from '../../../TemplateProvider';
import { createContext, useEffect, useState } from 'react';
import { getAudience } from 'apiHelper/ApiHandlers/privacyApi';
import { getGroupsAll } from '../../../../../../apiHelper/ApiHandlers/CNApi';
import { getUsers } from '../../../../../../apiHelper/ApiHandlers/usersApi';
import produce from 'immer';
const accessTypes = [
  { type: 'read', items: [] },
  { type: 'create', items: [] },
  { type: 'modify', items: [] },
];
export const useCMConfidentiality = ({ type }) => {
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const { AppID } = useTemplateContext();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(accessTypes);
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState(accessTypes);

  useEffect(() => {
    (async () => {
      const audience = await getAudience({ ObjectID: AppID, Type: type });
      const groups = await getGroupsAll();
      const users = await getUsers({ IsApproved: true });
      setUsers(users);
      setGroups(groups);
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

  const handleSelection = (e) => {
    setSelectedOption(e?.value);
  };

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

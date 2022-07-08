import { useTemplateContext } from '../../../TemplateProvider';
import { useEffect, useState } from 'react';
import {
  getAudience,
  PERMISSION_TYPE,
  PRIVACY_OBJECT_TYPE,
  setAudience,
} from 'apiHelper/ApiHandlers/privacyApi';
import { getGroupsAll } from 'apiHelper/ApiHandlers/CNAPI';
import { getUsers } from 'apiHelper/ApiHandlers/usersApi';
import produce from 'immer';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { decodeBase64 } from 'helpers/helpers';

const accessTypes = [
  { type: PERMISSION_TYPE.View, items: [] },
  { type: PERMISSION_TYPE.Create, items: [] },
  { type: PERMISSION_TYPE.Modify, items: [] },
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
  const [audiences, setAudiences] = useState();
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const _audience = await getAudience({ ObjectID: NodeTypeID, Type: type });
      const _groups = await getGroupsAll();
      const _users = await getUsers({ IsApproved: true });
      setUsers(_users);
      setGroups(_groups);
      setAudiences(_audience);
      setLoading(false);
    };
    isMounted && fetchData();
    return () => {
      isMounted = false;
    };
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
    let isMounted = true;
    const setPermisson = async () => {
      if (selectedOption === 'GRANTED') {
        await setBasicPermission({ DefaultValue: true });
      } else if (selectedOption === 'CLASSIFIED') {
        await setBasicPermission({ DefaultValue: false });
      }
    };
    isMounted && setPermisson();
    return () => {
      isMounted = false;
    };
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

    await setAudienceApiCall(Data);
  };

  // handle setAudience api call in term of custom user/group id selection
  const handleAudienceSelection = async (_audience, PermissionType) => {
    let DefaultPermissions = audiences?.Items[
      `${NodeTypeID}`
    ]?.DefaultPermissions?.map((x) => {
      if (x.DefaultValue === 'Public') {
        return { ...x, DefaultValue: true };
      }
      return { ...x, DefaultValue: false };
    });

    if (PermissionType === PERMISSION_TYPE.Modify) {
      DefaultPermissions = DefaultPermissions?.filter(
        (x) =>
          x.PermissionType !== PERMISSION_TYPE.Modify &&
          x.PermissionType !== PERMISSION_TYPE.Delete
      ).concat([
        {
          PermissionType: PERMISSION_TYPE.Modify,
          DefaultValue: false,
        },
        {
          PermissionType: PERMISSION_TYPE.Delete,
          DefaultValue: false,
        },
      ]);
    } else {
      DefaultPermissions = DefaultPermissions?.filter(
        (x) => x.PermissionType !== PermissionType
      ).concat([
        {
          PermissionType,
          DefaultValue: false,
        },
      ]);
    }

    const Data = {
      [NodeTypeID]: {
        Audience: [..._audience],
        DefaultPermissions,
      },
    };
    await setAudienceApiCall(Data);
  };

  const handlePermissionTypeSelection = async (
    PermissionType,
    DefaultValue
  ) => {
    let DefaultPermissions = audiences?.Items[
      `${NodeTypeID}`
    ]?.DefaultPermissions?.map((x) => {
      if (x.DefaultValue === 'Public') {
        return { ...x, DefaultValue: true };
      }
      return { ...x, DefaultValue: false };
    });

    if (PermissionType === PERMISSION_TYPE.Modify) {
      DefaultPermissions = DefaultPermissions?.filter(
        (x) =>
          x.PermissionType !== PERMISSION_TYPE.Modify &&
          x.PermissionType !== PERMISSION_TYPE.Delete
      ).concat([
        {
          PermissionType: PERMISSION_TYPE.Modify,
          DefaultValue,
        },
        {
          PermissionType: PERMISSION_TYPE.Delete,
          DefaultValue,
        },
      ]);
    } else {
      DefaultPermissions = DefaultPermissions?.filter(
        (x) => x.PermissionType !== PermissionType
      ).concat([
        {
          PermissionType,
          DefaultValue,
        },
      ]);
    }

    const Data = {
      [NodeTypeID]: {
        DefaultPermissions,
      },
    };

    await setAudienceApiCall(Data);
  };

  const setAudienceApiCall = async (Data) => {
    const { ErrorText, Succeed } = await setAudience({
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
      const _audience = await getAudience({ ObjectID: NodeTypeID, Type: type });
      setAudiences(_audience);
    }
  };

  const initializeTopLevelOption = () => {
    const Audience = audiences?.Items[`${NodeTypeID}`]?.Audience?.map((x) => ({
      ...x,
      RoleType: decodeBase64(x?.RoleType),
    }));

    setSelectedGroups(
      produce((d) => {
        Audience.filter((x) => x?.RoleType === 'Node').forEach((item) => {
          const t = d.find((x) => x.type === item?.PermissionType);
          if (t) {
            t?.items.push(item?.RoleID);
          }
        });
      })
    );

    setSelectedUsers(
      produce((d) => {
        Audience.filter((x) => x?.RoleType === 'User').forEach((item) => {
          const t = d.find((x) => x.type === item?.PermissionType);
          if (t) {
            t?.items.push(item?.RoleID);
          }
        });
      })
    );

    const DefaultPermissions =
      audiences?.Items[`${NodeTypeID}`]?.DefaultPermissions;

    const allAllowed = DefaultPermissions?.filter(
      (x) => x?.DefaultValue === 'Public'
    );

    const allDenied = DefaultPermissions?.filter(
      (x) => x?.DefaultValue === 'Restricted'
    );

    if (allAllowed?.length === 4 && Audience?.length === 0) {
      setSelectedOption('GRANTED');
    } else if (allDenied?.length === 4 && Audience?.length === 0) {
      setSelectedOption('CLASSIFIED');
    } else {
      setSelectedOption('ADVANCED');
    }
  };

  useEffect(() => {
    if (audiences) {
      initializeTopLevelOption();
    }
  }, [audiences]);

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
      permissionType: PERMISSION_TYPE.View,
    },
    {
      key: 2,
      label: 'ویرایش آیتم‌ها',
      permissionType: PERMISSION_TYPE.Modify,
    },
    {
      key: 3,
      label: 'ایجاد آیتم جدید',
      permissionType: PERMISSION_TYPE.Create,
    },
  ];

  return {
    options,
    users,
    groups,
    loading,
    audience: audiences,
    selectedOption,
    handleSelection,
    advancedOption,
    selectedUsers,
    handleUserSelect,
    selectedGroups,
    handleGroupSelect,
    handlePermissionTypeSelection,
    handleAudienceSelection,
  };
};

export default useCMConfidentiality;

import { useTemplateContext } from '../../../TemplateProvider';
import { createContext, useEffect, useState } from 'react';
import { getAudience } from 'apiHelper/ApiHandlers/privacyApi';
import { getGroupsAll } from '../../../../../../apiHelper/ApiHandlers/CNApi';
import { getUsers } from '../../../../../../apiHelper/ApiHandlers/usersApi';

export const useCMConfidentiality = ({ type }) => {
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const { AppID } = useTemplateContext();

  useEffect(() => {
    (async () => {
      const audience = await getAudience({ ObjectID: AppID, Type: type });
      const groups = await getGroupsAll();
      const users = await getUsers({ IsApproved: true });
      setLoading(false);
      console.log(audience);
    })();
  }, []);

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
      permissionType: '',
    },
    {
      key: 2,
      label: 'ویرایش آیتم‌ها',
      permissionType: '',
    },
    {
      key: 3,
      label: 'ایجاد آیتم جدید',
      permissionType: '',
    },
  ];

  return { options, loading, selectedOption, handleSelection, advancedOption };
};

export default useCMConfidentiality;

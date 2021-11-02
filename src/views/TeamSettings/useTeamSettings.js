/**
 * Controller portion for team settings view
 */
import useWindow from '../../hooks/useWindowContext';
import { useEffect, useState } from 'react';
import { decodeBase64 } from '../../helpers/helpers';
import {
  getTemplateTags,
  saveApplicationInfo,
} from '../../apiHelper/apiFunctions';

const useTeamSettings = (props) => {
  const { IconURL, ...appInfo } = props?.route?.Application;

  console.log(appInfo);

  const { RV_RTL: rtl, RVDic: dic } = useWindow();

  const [fieldOfExpertiseOption, setFieldOfExpertiseOption] = useState([]);
  const [applicationInfo, setApplicationInfo] = useState({
    ApplicationID: appInfo.ApplicationID,
    Title: decodeBase64(appInfo.Title),
    Tagline: '',
    Website: '',
    About: '',
    Size: '',
    ExpertiseFieldID: appInfo.FieldOfExpertise.ID,
    ExpertiseFieldName: decodeBase64(appInfo.FieldOfExpertise.Name),
    Language: '',
    Calender: '',
  });

  useEffect(async () => {
    try {
      const tagList = await getTemplateTags();
      const fields = tagList.Tags.map((x) => ({
        value: x.NodeID,
        label: decodeBase64(x.Name),
      }));
      setFieldOfExpertiseOption(fields);
      console.log(fields);
    } catch (err) {
      console.log('call api error: ' + err);
    }
  }, []);

  /**
   * @description items array to feed breadcrumbs component
   * @type {[{title: string}, {title: string}]}
   */
  const breadCrumbItems = [
    {
      id: 1,
      title: 'مدیریت تیم',
      linkTo: '',
    },
    {
      id: 2,
      title: 'تنظیمات تیم',
      linkTo: '',
    },
  ];

  const languageOption = [
    { value: 'fr', label: 'فارسی' },
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic' },
    { value: 'ku', label: 'Kurdish' },
  ];

  const calOption = [
    { value: 'jalali', label: 'هجری شمسی' },
    { value: 'lunar', label: 'هجری قمری' },
    { value: 'gregorian', label: 'میلادی (Gregorian)' },
    { value: 'kurdish', label: 'گاه شماری کردی' },
  ];

  const teamSizeOption = [
    { value: '1 - 10', label: '1 - 10' },
    { value: '10 - 20', label: '10 - 20' },
    { value: 'more than 20', label: 'بیشتر از 20' },
  ];

  const saveInfo = async () => {
    const {
      ApplicationID,
      Title,
      Tagline,
      Website,
      About,
      Size,
      ExpertiseFieldID,
      ExpertiseFieldName,
      Language,
      Calender,
    } = applicationInfo;

    try {
      await saveApplicationInfo(
        ApplicationID,
        Title,
        Tagline,
        Website,
        About,
        Size,
        ExpertiseFieldID,
        ExpertiseFieldName,
        Language,
        Calender
      );
    } catch (err) {
      console.log('saving app info error', err);
    }
  };

  /**
   * provide data to view portion of team settings view
   */
  return {
    IconURL,
    applicationInfo,
    setApplicationInfo,
    rtl,
    breadCrumbItems,
    fieldOfExpertiseOption,
    languageOption,
    calOption,
    teamSizeOption,
    saveInfo,
  };
};
export default useTeamSettings;

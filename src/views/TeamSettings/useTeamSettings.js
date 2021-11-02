/**
 * Controller portion for team settings view
 */
import useWindow from '../../hooks/useWindowContext';
import { useEffect } from 'react';
import {
  API_Provider,
  encodeBase64,
  decodeBase64,
} from '../../helpers/helpers';
import { getTemplateTags } from '../../apiHelper/apiFunctions';

const useTeamSettings = (props) => {
  const appInfo = props?.route?.Application;
  const teamTitle = decodeBase64(appInfo.Title);

  const { RV_RTL: rtl, RVDic: dic } = useWindow();

  useEffect(async () => {
    const tagList = await getTemplateTags();
    console.log(tagList);
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

  const teamOwnerOptions = [];

  const fieldOfExpertiseOption = [
    { value: 'industry', label: 'صنعت' },
    { value: 'med', label: 'پزشکی' },
    { value: 'it', label: 'فناوری اطلاعات' },
    { value: 'edu', label: 'آموزش' },
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
    { value: 'jalali', label: 'بیشتر از 100' },
    { value: 'lunar', label: '50-99 نفر' },
    { value: 'gregorian', label: '10-49 نفر' },
    { value: 'kurdish', label: 'کمتر از 10 نفر' },
  ];

  const uploadThumbnail = (fd, config) => {
    //
    console.log(fd, config);
  };

  /**
   * provide data to view portion of team settings view
   */
  return {
    appInfo,
    teamTitle,
    rtl,
    breadCrumbItems,
    fieldOfExpertiseOption,
    teamOwnerOptions,
    languageOption,
    calOption,
    teamSizeOption,
    uploadThumbnail,
  };
};
export default useTeamSettings;

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
import {
  ARABIC_LANGUAGE,
  ENGLISH_LANGUAGE,
  GREGORIAN_CALENDAR,
  JALALI_CALENDAR,
  KURDISH_CALENDAR,
  KURDISH_LANGUAGE,
  LUNAR_CALENDAR,
  MORE_THEN_TWENTY,
  ONE_TO_TEN,
  PERSIAN_LANGUAGE,
  TEN_TO_TWENTY,
} from '../../constant/constants';

const teamSettingsCtrl = (props) => {
  const { IconURL, ...appInfo } = props?.route?.Application;

  const { RV_RTL: rtl, RVDic: DIC } = useWindow();

  const [fieldOfExpertiseOption, setFieldOfExpertiseOption] = useState([]);
  const [applicationInfo, setApplicationInfo] = useState({
    ApplicationID: appInfo?.ApplicationID,
    Title: decodeBase64(appInfo?.Title),
    Tagline: decodeBase64(appInfo?.Tagline),
    Website: decodeBase64(appInfo?.Website),
    About: decodeBase64(appInfo?.About),
    Size: decodeBase64(appInfo?.Size),
    ExpertiseFieldID: appInfo?.FieldOfExpertise?.ID,
    ExpertiseFieldName: decodeBase64(appInfo?.FieldOfExpertise?.Name),
    Language: appInfo?.Language,
    Calendar: appInfo?.Calendar,
  });

  useEffect(async () => {
    try {
      const tagList = await getTemplateTags();
      const fields = tagList?.Tags?.map((x) => ({
        value: x?.NodeID,
        label: decodeBase64(x?.Name),
      }));
      setFieldOfExpertiseOption(fields);
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
    { value: PERSIAN_LANGUAGE, label: 'فارسی' },
    { value: ENGLISH_LANGUAGE, label: 'English' },
    { value: ARABIC_LANGUAGE, label: 'Arabic' },
    { value: KURDISH_LANGUAGE, label: 'Kurdish' },
  ];

  const calOption = [
    { value: JALALI_CALENDAR, label: 'هجری شمسی' },
    { value: LUNAR_CALENDAR, label: 'هجری قمری' },
    { value: GREGORIAN_CALENDAR, label: 'میلادی (Gregorian)' },
    { value: KURDISH_CALENDAR, label: 'گاه شماری کردی' },
  ];

  const teamSizeOption = [
    { value: ONE_TO_TEN, label: '1 - 10' },
    { value: TEN_TO_TWENTY, label: '10 - 20' },
    { value: MORE_THEN_TWENTY, label: 'بیشتر از 20' },
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
      Calendar,
    } = applicationInfo;

    try {
      const saveResult = await saveApplicationInfo(
        ApplicationID,
        Title,
        Tagline,
        Website,
        About,
        Size,
        ExpertiseFieldID,
        ExpertiseFieldName,
        Language,
        Calendar
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
    DIC,
    saveInfo,
  };
};
export default teamSettingsCtrl;

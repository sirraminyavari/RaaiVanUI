/**
 * Controller portion for team settings view
 */
import useWindow from '../../hooks/useWindowContext';
import { useEffect, useState } from 'react';
import { decodeBase64 } from '../../helpers/helpers';
import { saveApplicationInfo } from '../../apiHelper/apiFunctions';
import {
  ENGLISH_LANGUAGE,
  GREGORIAN_CALENDAR,
  JALALI_CALENDAR,
  MORE_THAN_TWENTY,
  ONE_TO_TEN,
  PERSIAN_LANGUAGE,
  TEN_TO_TWENTY,
} from '../../constant/constants';
import InfoToast from '../../components/toasts/info-toast/InfoToast';
import { getTemplateTags } from 'apiHelper/ApiHandlers/CNAPI/CNApi';

const useTeamSettings = (props) => {
  const { IconURL, ...appInfo } = props?.route?.Application;

  const { RV_RTL: rtl, RVDic } = useWindow();

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
    const tagList = await getTemplateTags();

    const fields = tagList?.Tags?.map((x) => ({
      value: x?.NodeID,
      label: decodeBase64(x?.Name),
    }));

    setFieldOfExpertiseOption(fields);
  }, []);

  /**
   * @description items array to feed breadcrumbs component
   * @type {object[]}
   */
  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: RVDic?.TeamInfo,
      linkTo: '',
    },
  ];

  const languageOption = [
    { value: PERSIAN_LANGUAGE, label: RVDic?.X?.Language?.Farsi },
    { value: ENGLISH_LANGUAGE, label: RVDic?.X?.Language?.English },
    // { value: ARABIC_LANGUAGE, label: RVDic?.X?.Language?.Arabic },
    // { value: KURDISH_LANGUAGE, label: RVDic?.X?.Language?.Kurdish },
  ];

  const calOption = [
    { value: JALALI_CALENDAR, label: RVDic?.X?.Calendar?.Jalali },
    // { value: LUNAR_CALENDAR, label: RVDic?.X?.Calendar?.LunarHijri },
    { value: GREGORIAN_CALENDAR, label: RVDic?.X?.Calendar?.Gregorian },
    // { value: KURDISH_CALENDAR, label: RVDic?.X?.Calendar?.Kurdish },
  ];

  const teamSizeOption = [
    { value: ONE_TO_TEN, label: '1 - 10' },
    { value: TEN_TO_TWENTY, label: '10 - 20' },
    { value: MORE_THAN_TWENTY, label: RVDic?.MoreThanN?.replace('[n]', 20) },
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

    saveApplicationInfo({
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
    })
      .then((res) => {
        console.log(res);
        if (res?.Succeed) {
          InfoToast({
            type: 'success',
            autoClose: true,
            message: `.تغییرات شما ذخیره شد`,
          });
        } else {
          InfoToast({
            type: 'error',
            autoClose: true,
            message: `خطایی رخ داد.`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        InfoToast({
          type: 'error',
          autoClose: true,
          message: `خطایی رخ داد.`,
        });
      });
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
    RVDic,
    saveInfo,
  };
};
export default useTeamSettings;

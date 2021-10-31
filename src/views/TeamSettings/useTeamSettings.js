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

const loadAppData = API_Provider('', '');
const IMAGE_URL =
  'https://img.freepik.com/free-vector/cute-cat-driving-spaceship-ufo-cartoon-icon-illustration-animal-technology-icon-concept-isolated-flat-cartoon-style_138676-2334.jpg?size=338&ext=jpg';
const useTeamSettings = (props) => {
  const appInfo = props?.route?.Application;
  const teamTitle = decodeBase64(appInfo.Title);
  // const { ApplicationID, IconURL, Title } = application;

  const { RV_RTL: rtl, RVDic: dic } = useWindow();

  const imgUrl = IMAGE_URL;

  useEffect(() => {}, []);

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

  const teamOwnerOptions = [
    {
      value: 'jahanian',
      label: 'خشایار جهانیان',
      thumb:
        'https://i.guim.co.uk/img/media/1e1f70e4478c8195bacaeea84a8df3e3bdd5add9/0_87_5120_3072/master/5120.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=ddf6debeb9048510f33cc60f90f433dd',
    },
    {
      value: 'mollazadeh',
      label: 'سپهر ملازاده',
      thumb:
        'https://i.guim.co.uk/img/media/1e1f70e4478c8195bacaeea84a8df3e3bdd5add9/0_87_5120_3072/master/5120.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=ddf6debeb9048510f33cc60f90f433dd',
    },
    {
      value: 'seif',
      label: 'امیرحسین سیف',
      thumb:
        'https://i.guim.co.uk/img/media/1e1f70e4478c8195bacaeea84a8df3e3bdd5add9/0_87_5120_3072/master/5120.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=ddf6debeb9048510f33cc60f90f433dd',
    },
  ];

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
    { value: 'solar', label: 'هجری شمسی' },
    { value: 'lunar', label: 'هجری قمری' },
    { value: 'gregorian', label: 'میلادی (Gregorian)' },
    { value: 'kurdish', label: 'گاه شماری کردی' },
  ];

  const teamSizeOption = [
    { value: 'solar', label: 'بیشتر از 100' },
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
    imgUrl,
    fieldOfExpertiseOption,
    teamOwnerOptions,
    languageOption,
    calOption,
    teamSizeOption,
    uploadThumbnail,
  };
};
export default useTeamSettings;

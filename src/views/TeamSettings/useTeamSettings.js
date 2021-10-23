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
  const teamId = props?.match?.params?.id;

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
      value: 'seif',
      label: 'خشایار جهانیان',
      thumb:
        'https://i.guim.co.uk/img/media/1e1f70e4478c8195bacaeea84a8df3e3bdd5add9/0_87_5120_3072/master/5120.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=ddf6debeb9048510f33cc60f90f433dd',
    },
    {
      value: 'sepehr',
      label: 'خشایار جهانیان',
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

  const uploadThumbnail = (fd) => {
    //
  };

  /**
   * provide data to view portion of team settings view
   */
  return {
    teamId,
    rtl,
    breadCrumbItems,
    imgUrl,
    fieldOfExpertiseOption,
    teamOwnerOptions,
    uploadThumbnail,
  };
};
export default useTeamSettings;

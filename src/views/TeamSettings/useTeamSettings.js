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
    uploadThumbnail,
  };
};
export default useTeamSettings;

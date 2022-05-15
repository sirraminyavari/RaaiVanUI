import * as Styles from './CMTemplateAdvancedSettingStyles';
import { decodeBase64 } from 'helpers/helpers';
import { useParams } from 'react-router-dom';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';

const CMTemplateAdvancedSetting = () => {
  const { RVDic } = window;
  const { id, title } = useParams();
  const breadItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: 'مدیریت قالب ها',
      linkTo: '',
    },
    {
      id: 3,
      title: `قالب ${decodeBase64(title)}`,
      linkTo: '',
    },
    {
      id: 4,
      title: 'تنظیمات پیشرفته',
      linkTo: '',
    },
  ];

  return (
    <Styles.Container>
      <Breadcrumb items={breadItems} />
    </Styles.Container>
  );
};
export default CMTemplateAdvancedSetting;

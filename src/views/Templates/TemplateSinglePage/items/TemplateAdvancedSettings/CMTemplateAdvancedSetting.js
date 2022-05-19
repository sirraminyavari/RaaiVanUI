import * as Styles from './TemplateAdvancedSettingStyles';
import { decodeBase64 } from 'helpers/helpers';
import { useParams } from 'react-router-dom';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import AnimatedInput from '../../../../../components/Inputs/AnimatedInput';
import CodingPattern from './items/CodingPattern';
import { InputContainer } from './TemplateAdvancedSettingStyles';

const CMTemplateAdvancedSetting = () => {
  const { RVDic, RV_RTL: rtl } = window;
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
      <Styles.ReturnButton rtl={rtl}>{RVDic?.Return}</Styles.ReturnButton>

      <Styles.CMContentContainer>
        <Styles.InputContainer>
          <Styles.InputLabel>{'شناسه تمپلیت'}</Styles.InputLabel>
          <AnimatedInput placeholder={'شناسه تمپلیت'} />
        </Styles.InputContainer>

        <Styles.InputContainer>
          <Styles.InputLabel>{'الگوی کددهی آیتم‌ها'}</Styles.InputLabel>
          <CodingPattern />
        </Styles.InputContainer>
      </Styles.CMContentContainer>
    </Styles.Container>
  );
};
export default CMTemplateAdvancedSetting;

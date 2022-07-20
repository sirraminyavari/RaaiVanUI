import * as Styles from './TemplateAdvancedSettingStyles';
import { decodeBase64 } from 'helpers/helpers';
import { useParams } from 'react-router-dom';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import CodingPattern from './items/CodingPattern';
import CoverPatternUploader from './items/CoverPatternUploader';
import useAdvancedSetting from './useAdvancedSetting';

const CMTemplateAdvancedSetting = () => {
  const { RVDic, RV_RTL: rtl } = window;
  const { id, title } = useParams();
  const { Pattern } = useAdvancedSetting();

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
          <Styles.IdInput placeholder={'شناسه تمپلیت'} />
        </Styles.InputContainer>

        <Styles.InputContainer>
          <Styles.InputLabel>{'الگوی کددهی آیتم‌ها'}</Styles.InputLabel>
          <CodingPattern pattern={Pattern} />
        </Styles.InputContainer>

        <Styles.InputContainer>
          <Styles.InputLabel>{'PDF الگوی جلد فایل'}</Styles.InputLabel>
          <CoverPatternUploader />
        </Styles.InputContainer>
      </Styles.CMContentContainer>
    </Styles.Container>
  );
};
export default CMTemplateAdvancedSetting;

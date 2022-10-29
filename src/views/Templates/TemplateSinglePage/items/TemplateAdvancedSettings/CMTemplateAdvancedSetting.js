import * as Styles from './TemplateAdvancedSettingStyles';
import { decodeBase64 } from 'helpers/helpers';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import CodingPattern from './items/CodingPattern';
import CoverPatternUploader from './items/CoverPatternUploader';
import useAdvancedSetting from './useAdvancedSetting';
import {
  TEAM_SETTINGS_PATH,
  TEMPLATES_SETTING_PATH,
  TEMPLATES_SETTING_SINGLE_PATH,
} from 'constant/constants';
import { useTemplateContext } from '../../TemplateProvider';
import ReturnButton from 'components/Buttons/ReturnButton';
import { useHistory } from 'react-router-dom';

const CMTemplateAdvancedSetting = () => {
  const { RVDic, RV_RTL: rtl } = window;
  const { Title, NodeTypeID } = useTemplateContext();
  const { Pattern } = useAdvancedSetting();
  const history = useHistory();

  const returnToTemplates = () =>
    history.push(TEMPLATES_SETTING_SINGLE_PATH.replace(':id', NodeTypeID));

  const breadItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: TEAM_SETTINGS_PATH.replace(':id', NodeTypeID),
    },
    {
      id: 2,
      title: RVDic?.TemplateManagement,
      linkTo: TEMPLATES_SETTING_PATH,
    },
    {
      id: 3,
      title: `قالب ${decodeBase64(Title)}`,
      linkTo: TEMPLATES_SETTING_SINGLE_PATH.replace(':id', NodeTypeID),
    },
    {
      id: 4,
      title: 'تنظیمات پیشرفته',
    },
  ];

  return (
    <Styles.Container>
      <Styles.HeaderContainer>
        <Breadcrumb items={breadItems} />
        <ReturnButton onClick={returnToTemplates} />
      </Styles.HeaderContainer>

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

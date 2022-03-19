import * as Styles from './TextTypeSideBoxSettingStyles';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import { useTemplateFormContext } from '../../TemplateFormContext';

const TextTypeSideBoxSetting = ({ data, ...rest }) => {
  const { Necessary, UniqueValue } = data;
  const l = useTemplateFormContext();
  // console.log(l);

  return (
    <Styles.Container>
      <Styles.ToggleRow>
        <div>{'فیلد ضروری'}</div>
        <div>
          <ToggleButton value={Necessary} />
        </div>
      </Styles.ToggleRow>

      <Styles.ToggleRow>
        <div>{'پاسخ منحصربه‌فرد'}</div>
        <div>
          <ToggleButton value={UniqueValue} />
        </div>
      </Styles.ToggleRow>
    </Styles.Container>
  );
};
export default TextTypeSideBoxSetting;

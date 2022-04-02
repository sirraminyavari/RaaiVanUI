import AnimatedInput from 'components/Inputs/AnimatedInput';
import * as Styles from '../sharedItems/DraggableSharedSettingStyles';

const NumericalTypeMainSetting = ({ current, setFormObjects }) => {
  return (
    <Styles.FieldWrapper>
      <AnimatedInput placeholder={'عبارت پیش‌فرض کادر پاسخ'} />
    </Styles.FieldWrapper>
  );
};
export default NumericalTypeMainSetting;

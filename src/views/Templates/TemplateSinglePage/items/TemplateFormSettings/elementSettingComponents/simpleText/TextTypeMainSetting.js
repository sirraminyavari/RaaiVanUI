import AnimatedInput from 'components/Inputs/AnimatedInput';
import * as Styles from './TextTypeMainSettingStyles';

const TextTypeMainSetting = ({ current, setFormObjects }) => {
  return (
    <Styles.FieldWrapper>
      <AnimatedInput placeholder={'عبارت پیش‌فرض کادر پاسخ'} />
    </Styles.FieldWrapper>
  );
};
export default TextTypeMainSetting;

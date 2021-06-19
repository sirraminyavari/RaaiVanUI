import LockIcon from 'components/Icons/LockIcon/LockIcon';
import { TC_DEFAULT } from 'constant/Colors';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import FieldError from './FieldError';
import Button from 'components/Buttons/Button';
import * as Styled from './Profile.styles';
import useWindow from 'hooks/useWindowContext';

const ChangePassword = () => {
  const { RVDic } = useWindow();

  return (
    <div
      style={{
        flexGrow: 1,
      }}>
      <Styled.FieldTitleWrapper>
        <LockIcon
          size={22}
          className={TC_DEFAULT}
          style={{ verticalAlign: 'middle' }}
        />
        <Styled.ChangePassTitle>تغییر رمز عبور</Styled.ChangePassTitle>
      </Styled.FieldTitleWrapper>
      <AnimatedInput
        placeholder="رمز عبور جدید"
        style={{ margin: '2rem 0 1rem 0', width: '70%' }}
      />
      <AnimatedInput
        placeholder="تکرار رمز عبور جدید"
        style={{ marginBottom: '1rem', width: '70%' }}
      />
      <FieldError error="حداقل ۸ کاراکتر" />
      <FieldError error="هم کاراکتر حرف و هم عدد" />
      <FieldError error="حداقل یک حرف بزرگ و کوچک" />
      <Button style={{ width: '7rem', marginTop: '4rem', fontSize: '1rem' }}>
        {RVDic.Save}
      </Button>
    </div>
  );
};

export default ChangePassword;

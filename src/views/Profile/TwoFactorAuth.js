import { useState } from 'react';
import KeyIcon from 'components/Icons/KeyIcon/KeyIcon';
import { TC_DEFAULT } from 'constant/Colors';
import * as Styled from './Profile.styles';
import useWindow from 'hooks/useWindowContext';
import TwoFactorToggle from './TwoFactorToggle';
import TwoFactorOptions from './TwoFactorOptions';

const options = [
  { value: 'phone', title: 'شماره تماس ۸۵۷****۰۹۳', group: 'two-factor-auth' },
  {
    value: 'email',
    title: 'ایمیل admin******@gmail.com',
    group: 'two-factor-auth',
  },
];

const TwoFactorAuthentication = () => {
  const { RVDic } = useWindow();
  const [isTwoFactorOn, setIsTwoFactorOn] = useState(false);

  const handleTwoFactorToggle = (toggleValue) => {
    setIsTwoFactorOn(toggleValue);
  };

  return (
    <div
      style={{
        flexGrow: 1,
      }}>
      <Styled.FieldTitleWrapper>
        <KeyIcon
          size={22}
          className={TC_DEFAULT}
          style={{ verticalAlign: 'middle' }}
        />
        <Styled.ChangePassTitle>ورود دو مرحله ای</Styled.ChangePassTitle>
      </Styled.FieldTitleWrapper>

      <TwoFactorToggle
        onToggle={handleTwoFactorToggle}
        isChecked={isTwoFactorOn}
      />
      <TwoFactorOptions options={options} enabled={isTwoFactorOn} />
    </div>
  );
};

export default TwoFactorAuthentication;

import { useState } from 'react';
import KeyIcon from 'components/Icons/KeyIcon/KeyIcon';
import { TC_DEFAULT } from 'constant/Colors';
import * as Styled from 'views/Profile/Profile.styles';
import useWindow from 'hooks/useWindowContext';
import TwoFactorOptions from './TwoFactorOptions';
import TwoFactorToggle from 'components/Toggle/Toggle';

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
  //! If true, Show two factor option box.
  const [isTwoFactorOn, setIsTwoFactorOn] = useState(false);

  //! Toggle two factor options.
  const handleTwoFactorToggle = (toggleValue) => {
    setIsTwoFactorOn(toggleValue);
  };

  return (
    <Styled.ContentWrapper>
      <Styled.FieldTitleWrapper>
        <KeyIcon
          size={22}
          className={TC_DEFAULT}
          style={{ verticalAlign: 'middle' }}
        />
        <Styled.ChangePassTitle>
          {RVDic.TwoStepAuthentication}
        </Styled.ChangePassTitle>
      </Styled.FieldTitleWrapper>

      <TwoFactorToggle
        onToggle={handleTwoFactorToggle}
        isChecked={isTwoFactorOn}
        title="استفاده از ورود دو مرحله ای"
        containerClass="profile-security-toggle"
      />
      <TwoFactorOptions options={options} enabled={isTwoFactorOn} />
    </Styled.ContentWrapper>
  );
};

export default TwoFactorAuthentication;

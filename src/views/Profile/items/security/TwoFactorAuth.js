import { useState } from 'react';
import KeyIcon from 'components/Icons/KeyIcon/KeyIcon';
import { TC_DEFAULT } from 'constant/Colors';
import * as Styled from 'views/Profile/Profile.styles';
import useWindow from 'hooks/useWindowContext';
import TwoFactorOptions from './TwoFactorOptions';
import TwoFactorToggle from 'components/Toggle/Toggle';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import Button from 'components/Buttons/Button';
import AccountManIcon from 'components/Icons/AccountManIcon/AccountManIcon';
import VerificationCodeHandle from './VerificationCodeHandle';

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
  const [userId, setUserId] = useState('User id in cliqmind');
  const [isVerificationShown, setIsVerificationShown] = useState(false);

  //! Toggle two factor options.
  const handleTwoFactorToggle = (toggleValue) => {
    setIsTwoFactorOn(toggleValue);
  };

  const handleIDChange = (id) => {
    setUserId(id);
  };

  const handleSendCode = () => {
    setIsVerificationShown(false);
  };

  const handleTimeout = () => {
    setIsVerificationShown(false);
  };

  return (
    <Styled.ContentWrapper>
      <div style={{ marginBottom: '2rem' }}>
        <Styled.FieldTitleWrapper>
          <AccountManIcon
            size={22}
            className={TC_DEFAULT}
            style={{ verticalAlign: 'middle' }}
          />
          <Styled.FieldTitle>آیدی</Styled.FieldTitle>
        </Styled.FieldTitleWrapper>
        <Styled.InputWrapper>
          <AnimatedInput
            onChange={handleIDChange}
            value={userId}
            placeholder="آیدی"
            style={{ width: '70%' }}
          />
          <Button
            type="primary-o"
            classes="change-email-id-button"
            onClick={() => setIsVerificationShown((v) => !v)}>
            تغییر
          </Button>
        </Styled.InputWrapper>
      </div>
      {isVerificationShown && (
        <VerificationCodeHandle
          onSendCode={handleSendCode}
          onTimeout={handleTimeout}
          codeCount={5}
          countDown={120}
        />
      )}
      <Styled.FieldTitleWrapper>
        <KeyIcon
          size={22}
          className={TC_DEFAULT}
          style={{ verticalAlign: 'middle' }}
        />
        <Styled.FieldTitle>{RVDic.TwoStepAuthentication}</Styled.FieldTitle>
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

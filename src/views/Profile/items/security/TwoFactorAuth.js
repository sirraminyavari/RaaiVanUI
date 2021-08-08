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
import { TCV_DEFAULT } from 'constant/CssVariables';
// import VerificationCodeHandle from './VerificationCodeHandle';

const options = [
  { value: 'phone', title: 'شماره تماس ۸۵۷****۰۹۳', group: 'two-factor-auth' },
  {
    value: 'email',
    title: 'ایمیل admin******@gmail.com',
    group: 'two-factor-auth',
  },
];

const acceptedId = 'adminID';

const TwoFactorAuthentication = () => {
  const { RVDic } = useWindow();
  //! If true, Show two factor option box.
  const [isTwoFactorOn, setIsTwoFactorOn] = useState(false);
  const [userId, setUserId] = useState('آیدی در دسترس: adminID');
  // const [isVerificationShown, setIsVerificationShown] = useState(false);

  //! Toggle two factor options.
  const handleTwoFactorToggle = (toggleValue) => {
    setIsTwoFactorOn(toggleValue);
  };

  const handleIDChange = (id) => {
    setUserId(id);
  };

  // const handleSendCode = () => {
  //   setIsVerificationShown(false);
  // };

  // const handleTimeout = () => {
  //   setIsVerificationShown(false);
  // };

  const isIDButtonActive = userId === acceptedId;

  return (
    <Styled.ContentWrapper>
      <div style={{ marginBottom: '2rem', position: 'relative' }}>
        <Styled.FieldTitleWrapper>
          <AccountManIcon
            size={22}
            className={TC_DEFAULT}
            style={{ verticalAlign: 'middle' }}
          />
          <Styled.FieldTitle>آیدی</Styled.FieldTitle>
        </Styled.FieldTitleWrapper>
        <Styled.InputWrapper isIDButtonActive={isIDButtonActive}>
          <AnimatedInput
            onChange={handleIDChange}
            value={userId}
            placeholder="آیدی"
            style={{ width: '70%' }}
          />
          <Button
            type="primary-o"
            disable={!isIDButtonActive}
            classes="change-id-button"
            onClick={() => {}}>
            تغییر
          </Button>
        </Styled.InputWrapper>
        {isIDButtonActive && (
          <div
            style={{
              position: 'absolute',
              top: '6rem',
              right: '0.5rem',
              color: TCV_DEFAULT,
            }}>
            این آیدی برای شما در دسترسه :)
          </div>
        )}
      </div>
      {/* {isVerificationShown && (
        <VerificationCodeHandle
          onSendCode={handleSendCode}
          onTimeout={handleTimeout}
          codeCount={5}
          countDown={120}
        />
      )} */}
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

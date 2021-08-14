import { useState, useEffect } from 'react';
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
import { decodeBase64 } from 'helpers/helpers';
import { checkUserName, changeUserName } from 'apiHelper/apiFunctions';
import useDebounce from 'hooks/useDebounce';
// import VerificationCodeHandle from './VerificationCodeHandle';

const options = [
  { value: 'phone', title: 'شماره تماس ۸۵۷****۰۹۳', group: 'two-factor-auth' },
  {
    value: 'email',
    title: 'ایمیل admin******@gmail.com',
    group: 'two-factor-auth',
  },
];

const TwoFactorAuthentication = ({ user }) => {
  const { RVDic } = useWindow();
  const { UserName, UserID } = user || {};

  //! If true, Show two factor option box.
  const [isTwoFactorOn, setIsTwoFactorOn] = useState(false);
  const [userName, setUserName] = useState(decodeBase64(UserName));
  const [isValidUserName, setIsValidUserName] = useState(false);
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const debouncedUserName = useDebounce(userName, 500);
  // const [isVerificationShown, setIsVerificationShown] = useState(false);

  //! Toggle two factor options.
  const handleTwoFactorToggle = (toggleValue) => {
    setIsTwoFactorOn(toggleValue);
  };

  const handleUserNameChange = (userName) => {
    setUserName(userName);
    setIsValidUserName(false);
  };

  useEffect(() => {
    if (!debouncedUserName) return;
    if (decodeBase64(UserName) !== debouncedUserName.trim()) {
      setIsCheckingUserName(true);
      checkUserName(debouncedUserName)
        .then((response) => {
          setIsValidUserName(!response);
          setIsCheckingUserName(false);
          // console.log(response);
        })
        .catch((error) => {
          setIsCheckingUserName(false);
          console.log(error);
        });
    } else {
      setIsValidUserName(false);
    }

    //! Clean up.
    return () => {
      setIsValidUserName(false);
    };
  }, [debouncedUserName, UserName]);

  const handleSaveUserName = () => {
    if (!isValidUserName || isCheckingUserName || !userName) return;
    changeUserName(UserID, userName)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  // const handleSendCode = () => {
  //   setIsVerificationShown(false);
  // };

  // const handleTimeout = () => {
  //   setIsVerificationShown(false);
  // };

  return (
    <Styled.ContentWrapper>
      <div style={{ marginBottom: '2rem', position: 'relative' }}>
        <Styled.FieldTitleWrapper>
          <AccountManIcon
            size={22}
            className={TC_DEFAULT}
            style={{ verticalAlign: 'middle' }}
          />
          <Styled.FieldTitle>{RVDic.UserName}</Styled.FieldTitle>
        </Styled.FieldTitleWrapper>
        <Styled.InputWrapper isIDButtonActive={isValidUserName}>
          <AnimatedInput
            onChange={handleUserNameChange}
            value={userName}
            placeholder={RVDic.UserName}
            style={{ width: '70%' }}
          />
          <Button
            loading={isCheckingUserName}
            type="primary-o"
            disable={!isValidUserName}
            classes="change-id-button"
            onClick={handleSaveUserName}>
            تغییر
          </Button>
        </Styled.InputWrapper>
        {isValidUserName && (
          <div
            style={{
              position: 'absolute',
              top: '7rem',
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

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
import { CV_RED, TCV_DEFAULT } from 'constant/CssVariables';
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
  //! See if user name is already taken or not..
  const [isValidUserName, setIsValidUserName] = useState(false);
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [isSavingUserName, setIsSavingUserName] = useState(false);
  const [userNameMessage, setUserNameMessage] = useState({
    type: '',
    text: '',
  });
  const debouncedUserName = useDebounce(userName, 500);
  // const [isVerificationShown, setIsVerificationShown] = useState(false);

  //! Toggle two factor options.
  const handleTwoFactorToggle = (toggleValue) => {
    setIsTwoFactorOn(toggleValue);
  };

  //! Set error state for user name field.
  const setError = (errorText) => {
    setUserNameMessage({
      type: 'error',
      text: errorText,
    });
    setIsValidUserName(false);
  };

  //! Fires when user types insdie input field.
  const handleUserNameChange = (userName) => {
    setUserName(userName);
    setIsValidUserName(false);
    setUserNameMessage({ type: '', text: '' });
  };

  //! Keep track of user name value and check if exists on server.
  useEffect(() => {
    //! Don't check if there is no user name.
    if (!debouncedUserName) return;
    //! Don't check if user name is same as before.
    if (decodeBase64(UserName) !== debouncedUserName.trim()) {
      setIsCheckingUserName(true);
      checkUserName(debouncedUserName)
        .then((response) => {
          setIsCheckingUserName(false);
          setIsValidUserName(!response);
          setUserNameMessage({
            type: 'info',
            text: 'این آیدی برای شما در دسترسه :)',
          });
        })
        .catch((error) => {
          setIsCheckingUserName(false);
          setError(error);
        });
    } else {
      setIsValidUserName(false);
    }

    //! Clean up.
    return () => {
      setIsValidUserName(false);
      setUserNameMessage({ type: '', text: '' });
    };
  }, [debouncedUserName, UserName]);

  //! Save new user name.
  const handleSaveUserName = () => {
    if (!isValidUserName || isCheckingUserName || !userName) return;
    setIsSavingUserName(true);
    changeUserName(UserID, userName)
      .then((response) => {
        setIsSavingUserName(false);
        if (response.Succeed) {
          //! Show modal if needed!
        }
        if (response.ErrorText) {
          setError(RVDic.MSG[response.ErrorText]);
        }
      })
      .catch((error) => {
        setIsSavingUserName(false);
        setError(error);
      });
  };

  //! when input is empty, fallback to current user name.
  const handleUserNameBlur = () => {
    if (!userName) {
      setUserName(decodeBase64(UserName));
    }
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
            onBlur={handleUserNameBlur}
            onChange={handleUserNameChange}
            value={userName}
            placeholder={RVDic.UserName}
            style={{ width: '70%' }}
          />
          <Button
            loading={isCheckingUserName || isSavingUserName}
            type="primary-o"
            disable={!isValidUserName}
            classes="change-id-button"
            onClick={handleSaveUserName}>
            تغییر
          </Button>
        </Styled.InputWrapper>
        <div
          style={{
            position: 'absolute',
            top: '7rem',
            right: '0.5rem',
            color: userNameMessage.type === 'error' ? CV_RED : TCV_DEFAULT,
          }}>
          {userNameMessage?.text}
        </div>
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

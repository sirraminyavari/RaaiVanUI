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
import {
  checkUserName,
  changeUserName,
  setVerificationCodeMedia,
} from 'apiHelper/apiFunctions';
import useDebounce from 'hooks/useDebounce';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { TOAST_TIMEOUT } from 'constant/constants';

const TwoFactorAuthentication = ({ user }) => {
  const { RVDic } = useWindow();
  const { UserName, UserID, VerificationCodeMedia, Emails, PhoneNumbers } =
    user || {};

  //! If true, Show two factor option box.
  const [isTwoFactorOn, setIsTwoFactorOn] = useState(!!VerificationCodeMedia);
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

  const provideOptions = () => {
    const options = [];
    if (!!Emails?.length) {
      options.push({
        value: 'Email',
        title: `${RVDic.Email} : ${decodeBase64(Emails?.[0].Email)}`,
        group: 'two-factor-auth',
      });
    }
    if (!!PhoneNumbers?.length) {
      options.push({
        value: 'SMS',
        title: `${RVDic.PhoneNumber} : ${decodeBase64(
          PhoneNumbers?.[0].Number
        )}`,
        group: 'two-factor-auth',
      });
    }
    return options;
  };

  /**
   * @description Provides an appropriate message according to RVDics.
   * @param {String} msg
   * @returns A string message.
   */
  const getMessage = (msg) => {
    return RVDic.MSG[msg] || msg;
  };

  /**
   * @description Renders a toast.
   * @param {('error' | 'info' | 'success' | 'warning' | 'dark')} type -The type of the toast.
   * @param {String} message -The message of the toast.
   */
  const renderToast = (type, message) => {
    return InfoToast({
      type,
      autoClose: TOAST_TIMEOUT,
      message: getMessage(message),
    });
  };

  //! Toggle two factor options.
  const handleTwoFactorToggle = (toggleValue) => {
    setIsTwoFactorOn(toggleValue);
    if (toggleValue) {
      //! Turn on code media area.
      setVerificationCodeMedia('On')
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    } else {
      //! Turn off code media area.
      setVerificationCodeMedia()
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    }
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
          const successMSG = 'نام کاربری با موفقیت تغییر کرد';
          renderToast('success', successMSG);
        }
        if (response.ErrorText) {
          let resError = response.ErrorText;
          setError(() => getMessage(resError));
          renderToast('error', resError);
        }
      })
      .catch((error) => {
        setIsSavingUserName(false);
        setError(error);
        renderToast('error', error);
      });
  };

  //! when input is empty, fallback to current user name.
  const handleUserNameBlur = () => {
    if (!userName) {
      setUserName(decodeBase64(UserName));
    }
  };

  const handleMediaSelection = (media) => {
    // console.log(media);
    setVerificationCodeMedia(media)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

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
        <Styled.InputWrapper isButtonActive={isValidUserName}>
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
            classes="change-button"
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
        title={RVDic.EnableTwoStepAuthentication}
        containerClass="profile-security-toggle"
      />
      <TwoFactorOptions
        media={VerificationCodeMedia}
        options={provideOptions()}
        enabled={isTwoFactorOn}
        onSelectOption={handleMediaSelection}
      />
    </Styled.ContentWrapper>
  );
};

export default TwoFactorAuthentication;

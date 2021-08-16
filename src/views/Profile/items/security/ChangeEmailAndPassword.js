import { useState, useEffect } from 'react';
import LockIcon from 'components/Icons/LockIcon/LockIcon';
import EmailIcon from 'components/Icons/MailIcon/MailIcon';
import { TC_DEFAULT } from 'constant/Colors';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import Button from 'components/Buttons/Button';
import * as Styled from 'views/Profile/Profile.styles';
import useWindow from 'hooks/useWindowContext';
import PasswordValidation from 'components/PasswordValidation/PasswordValidation';
import VerificationCodeHandle from './VerificationCodeHandle';
import {
  getPasswordPolicy,
  changeUserPassword,
  resetUserPassword,
  setUserPassword,
  resetUserEmail,
  modifyUserEmail,
} from 'apiHelper/apiFunctions';
import PasswordValidator from 'utils/Validation/PasswordValidator';
import { decodeBase64 } from 'helpers/helpers';

const commonInputStyles = { marginBottom: '1rem', width: '70%' };
const DEFAULT_VERIFICATION = {
  isShown: false,
  code: {},
};

const ChangeEmailAndPassword = ({ user, captchaToken }) => {
  const { RVDic, RVGlobal } = useWindow();
  const { UserID, Emails } = user || {};
  const [passwordPolicy, setPasswordPolicy] = useState(null);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [isPolicyShown, setIsPolicyShown] = useState(false);
  const [canSavePass, setCanSavePass] = useState(false);
  const [emailVerification, setEmailVerification] = useState(
    DEFAULT_VERIFICATION
  );
  const [passVerification, setPassVerification] = useState(
    DEFAULT_VERIFICATION
  );

  let currentEmailId = Emails?.[0]?.EmailID;
  let currentEmailAddress = decodeBase64(Emails?.[0]?.Email);

  const isSaas = (RVGlobal || {}).SAASBasedMultiTenancy;
  const isSameEmailAddress = currentEmailAddress === email;

  useEffect(() => {
    setEmail(decodeBase64(Emails?.[0]?.Email));

    //! Clean up.
    return () => {
      setEmail('');
    };
  }, [Emails]);

  useEffect(() => {
    getPasswordPolicy()
      .then((response) => setPasswordPolicy(response))
      .catch((error) => console.log(error));

    //? Due to memory leak error in component.
    //! Clean up.
    return () => {
      setPasswordPolicy(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCurrentPass = (currentPass) => {
    setCurrentPass(currentPass);
  };

  const handleNewPass = (newPass) => {
    setNewPass(newPass);
  };

  const handleNewPassConfirm = (newPassConfirm) => {
    setNewPassConfirm(newPassConfirm);
  };

  const handleEmailChange = (email) => {
    setEmail(email);
  };

  //! Send verification code to change email.
  const handleSendEmailCode = (code) => {
    // console.log(code);
    modifyUserEmail(code, emailVerification?.code.Token)
      .then((response) => {
        // console.log(response);
        if (response.ErrorText) {
          alert(RVDic.MSG[response.ErrorText] || response.ErrorText);
        }
        if (response.Succeed) {
          setEmailVerification(DEFAULT_VERIFICATION);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //! Send verification code to change password.
  const handleSendPassCode = (code) => {
    // console.log(code);
    setUserPassword(code, passVerification?.code.Token)
      .then((response) => {
        // console.log(response);
        if (response.ErrorText) {
          alert(RVDic.MSG[response.ErrorText] || response.ErrorText);
        }
        if (response.Succeed) {
          setPassVerification(DEFAULT_VERIFICATION);
        }
      })
      .catch((error) => console.log(error));
  };

  const showPassPolicy = () => {
    setIsPolicyShown(true);
  };

  const hidePassPolicy = () => {
    setIsPolicyShown(false);
  };

  const handleEmailTimeout = () => {
    setEmailVerification(DEFAULT_VERIFICATION);
  };

  const handlePassTimeout = () => {
    setPassVerification(DEFAULT_VERIFICATION);
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmail(currentEmailAddress);
    }
  };

  //! Send code to user for email modification.
  const handleChangeEmail = () => {
    if (isSameEmailAddress) return;

    resetUserEmail(currentEmailId, email, captchaToken)
      .then((response) => {
        console.log(response);
        if (response?.ErrorText) {
          alert(RVDic.MSG[response?.ErrorText] || response?.ErrorText);
        } else {
          setEmailVerification({
            isShown: true,
            code: response?.VerificationCode,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSavePassword = () => {
    if (!newPass || !newPassConfirm) return;
    //! Change password in Saas mode.
    if (isSaas) {
      //! send verification code.
      console.log('In Saas');
      resetUserPassword(email, newPass, captchaToken)
        .then((response) => {
          // console.log(response);
          if (response?.ErrorText) {
            alert(RVDic.MSG[response?.ErrorText] || response?.ErrorText);
          } else if (response?.VerificationCode) {
            setNewPass('');
            setNewPassConfirm('');
            alert(RVDic.MSG['AnEmailContainingPasswordResetLinkSentToYou']);
            setPassVerification({
              isShown: true,
              code: response?.VerificationCode,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      //! If user is 'NOT' in saas mode.
      console.log('Not in Saas');
      changeUserPassword(UserID, currentPass, newPass)
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    }
  };

  //! Keep track of the new password, And check if it is valid or not.
  useEffect(() => {
    if (!!passwordPolicy) {
      const isPassValid = Object.values(
        PasswordValidator(newPass, passwordPolicy)
      ).every(Boolean);

      setCanSavePass(isPassValid);
    }

    return () => {
      setCanSavePass(false);
    };
  }, [newPass, passwordPolicy]);

  return (
    <Styled.ContentWrapper>
      <div style={{ marginBottom: '0.5rem' }}>
        <Styled.FieldTitleWrapper>
          <EmailIcon
            fill
            size={22}
            className={TC_DEFAULT}
            style={{ verticalAlign: 'middle' }}
          />
          <Styled.FieldTitle>{RVDic.EMail}</Styled.FieldTitle>
        </Styled.FieldTitleWrapper>
        <Styled.InputWrapper isButtonActive={!isSameEmailAddress}>
          <AnimatedInput
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            value={email}
            placeholder={RVDic.EMail}
            style={{ width: '70%' }}
          />
          <Button
            disable={emailVerification.isShown || isSameEmailAddress}
            type="primary-o"
            classes="change-button"
            onClick={handleChangeEmail}>
            تغییر
          </Button>
        </Styled.InputWrapper>
      </div>
      {emailVerification?.isShown && (
        <VerificationCodeHandle
          onSendCode={handleSendEmailCode}
          onTimeout={handleEmailTimeout}
          codeCount={emailVerification?.code?.Length}
          countDown={emailVerification?.code?.Timeout}
        />
      )}
      <Styled.FieldTitleWrapper>
        <LockIcon
          size={22}
          className={TC_DEFAULT}
          style={{ verticalAlign: 'middle' }}
        />
        <Styled.FieldTitle>{RVDic.ChangePassword}</Styled.FieldTitle>
      </Styled.FieldTitleWrapper>
      {!isSaas && (
        <AnimatedInput
          type="password"
          onChange={handleCurrentPass}
          value={currentPass}
          placeholder={RVDic.CurrentPassword}
          style={commonInputStyles}
        />
      )}
      <AnimatedInput
        type="password"
        onChange={handleNewPass}
        onFocus={showPassPolicy}
        onBlur={hidePassPolicy}
        value={newPass}
        placeholder={RVDic.NewPassword}
        style={commonInputStyles}
      />
      <AnimatedInput
        type="password"
        onChange={handleNewPassConfirm}
        value={newPassConfirm}
        placeholder={RVDic.RepeatNewPassword}
        style={commonInputStyles}
      />
      {passVerification?.isShown && (
        <VerificationCodeHandle
          onSendCode={handleSendPassCode}
          onTimeout={handlePassTimeout}
          codeCount={passVerification?.code?.Length}
          countDown={passVerification?.code?.Timeout}
        />
      )}
      {!!passwordPolicy && isPolicyShown && (
        <PasswordValidation
          style={{
            opacity: '0',
            transition: 'opacity 1s',
          }}
          isVisible={true}
          password={newPass}
          passwordPolicy={passwordPolicy}
        />
      )}
      {newPassConfirm && !passVerification.isShown && (
        <Button
          onClick={handleSavePassword}
          disable={!canSavePass || newPass !== newPassConfirm}
          style={{
            width: '8rem',
            fontSize: '1rem',
            marginTop: '1rem',
          }}>
          {RVDic.Save}
        </Button>
      )}
    </Styled.ContentWrapper>
  );
};

export default ChangeEmailAndPassword;

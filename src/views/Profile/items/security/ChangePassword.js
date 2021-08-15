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
import { getPasswordPolicy, changeUserPassword } from 'apiHelper/apiFunctions';
import PasswordValidator from 'utils/Validation/PasswordValidator';

const commonInputStyles = { marginBottom: '1rem', width: '70%' };

const ChangePassword = ({ user }) => {
  const { RVDic, RVGlobal } = useWindow();
  const { UserID } = user || {};
  const [passwordPolicy, setPasswordPolicy] = useState(null);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');
  const [email, setEmail] = useState('email@cliqmind.com');
  const [hasEmailVerification, setHasEmailVerification] = useState(false);
  const [hasPassVerification, setHasPassVerification] = useState(false);
  const [isPolicyShown, setIsPolicyShown] = useState(false);
  const [canSavePass, setCanSavePass] = useState(false);

  const { SAASBasedMultiTenancy: isSaas } = RVGlobal;

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

  const handleSendCode = () => {
    setHasEmailVerification(false);
  };

  const showPassPolicy = () => {
    setIsPolicyShown(true);
  };

  const hidePassPolicy = () => {
    setIsPolicyShown(false);
  };

  const handleEmailTimeout = () => {
    setHasEmailVerification(false);
  };

  const handlePassTimeout = () => {
    setHasPassVerification(false);
  };

  const handleSavePassword = () => {
    setNewPass('');
    setNewPassConfirm('');
    // if (!currentPass || !newPass || !newPassConfirm) return;
    if (isSaas) {
      //! send verification code.
      console.log('In Saas');
      setHasPassVerification(true);
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
        <Styled.InputWrapper>
          <AnimatedInput
            onChange={handleEmailChange}
            value={email}
            placeholder={RVDic.EMail}
            style={{ width: '70%' }}
          />
          <Button
            type="primary-o"
            classes="change-email-button"
            onClick={() => setHasEmailVerification((v) => !v)}>
            تغییر
          </Button>
        </Styled.InputWrapper>
      </div>
      {hasEmailVerification && (
        <VerificationCodeHandle
          onSendCode={handleSendCode}
          onTimeout={handleEmailTimeout}
          codeCount={5}
          countDown={120}
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
      {hasPassVerification && (
        <VerificationCodeHandle
          onSendCode={handleSendCode}
          onTimeout={handlePassTimeout}
          codeCount={5}
          countDown={120}
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
      {newPassConfirm && !hasPassVerification && (
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

export default ChangePassword;

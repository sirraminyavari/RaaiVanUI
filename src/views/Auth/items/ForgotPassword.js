/**
 * The forgot password page. Helps the user to reset his/her password.
 */
import Button from 'components/Buttons/Button';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import CreateAccountButtons from './CreateAccountButtons';
import SetPasswordInput from 'components/Inputs/SetPassword/SetPasswordInput';
import ForgotPasswordWrapper from './ForgotPasswordWrapper';
import CheckPassword from 'utils/Validation/CheckPassword';
import MobileNumberValidator from 'utils/Validation/MobileNumberValidator';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';
import {
  setPasswordResetTicket,
  setPassword as savePassword,
} from 'apiHelper/ApiHandlers/usersApi';
import { REGISTER_PATH } from 'constant/constants';
import loggedInAction from 'store/actions/auth/loggedInAction';
import VerificationCodeDialog from './VerificationCodeDialog';

const { RVDic, RVGlobal, GlobalUtilities } = window;

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { goBack, push } = useHistory();

  const { initialEmail } = useSelector((state) => ({
    initialEmail: state.auth.email,
  }));

  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [shake, setShake] = useState(0);
  const passwordPolicy = RVGlobal?.PasswordPolicy || {};

  //true means that sending verification code is in progress
  const [isSending, setIsSending] = useState(false);

  const [verificationCodeObject, setVerificationCodeObject] = useState(null);

  // Returns the user to the login page.
  const onReturn = () => {
    goBack();
  };

  const onSendVerifyCode = async () => {
    const invalidEmail =
      !GlobalUtilities.is_valid_email(email) && !MobileNumberValidator(email);
    const invalidPassword = !CheckPassword(password, passwordPolicy);

    setEmailError(invalidEmail ? RVDic.Checks.EmailIsNotValid : '');

    setPasswordError(
      invalidPassword ? RVDic.Checks.PasswordPolicyDoesNotMeet : ''
    );

    if (invalidEmail || invalidPassword) {
      setShake(GlobalUtilities.random());
      return;
    }

    setIsSending(true);

    const results = await setPasswordResetTicket({
      UserName: email.trim(),
      Password: password,
    });

    setIsSending(false);

    if (results?.ErrorText)
      alert(RVDic.MSG[results.ErrorText] || results.ErrorText, {
        autoClose: 20000,
      });
    else if (results?.VerificationCode)
      setVerificationCodeObject(results.VerificationCode);
  };

  const finalValidation = async (val, done = () => {}) => {
    const results = await savePassword({
      Token: verificationCodeObject?.Token,
      Code: val,
      Login: true,
    });

    if (results?.ErrorText)
      done(RVDic.MSG[results.ErrorText] || results.ErrorText);
    else {
      done();
      dispatch(loggedInAction(results));
    }
  };

  const onCreateAccount = () => {
    push(REGISTER_PATH + window.location.search);
  };

  return (
    <TransitionSwitchWrapper
      transitionKey={!!verificationCodeObject?.Token ? 'vr-code' : 'normal'}>
      {!!verificationCodeObject?.Token && (
        <ForgotPasswordWrapper
          codeMode={true}
          onCodeCancel={() => setVerificationCodeObject(null)}>
          <VerificationCodeDialog
            email={email}
            isSending={isSending}
            verificationCodeObject={verificationCodeObject}
            onCodeRequest={onSendVerifyCode}
            onConfirm={finalValidation}
          />
        </ForgotPasswordWrapper>
      )}
      {!verificationCodeObject?.Token && (
        <ForgotPasswordWrapper>
          <AnimatedInput
            onChange={(v) => {
              setEmail(v);
              setEmailError('');
            }}
            value={email}
            placeholder={RVDic?.EmailAddress}
            error={emailError}
            shake={shake}
            style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}
          />
          <SetPasswordInput
            placeholder={RVDic?.NewPassword}
            error={passwordError}
            shake={shake}
            style={common_style}
            onChange={(v) => setPassword(v)}
          />
          <Button
            onClick={onSendVerifyCode}
            type="negative"
            loading={isSending}
            disable={!email || !password}
            style={{
              width: '100%',
              textAlign: 'center',
              ...common_style,
              marginTop: '1.75rem',
            }}>
            {RVDic?.ChangePassword}
          </Button>
          <Button
            type="secondary-o"
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: '1rem',
              ...common_style,
              marginTop: '0.75rem',
            }}
            onClick={onReturn}>
            {RVDic.Return}
          </Button>
          <CreateAccountButtons
            isVisible={true}
            label={RVDic?.CreateAccount}
            onCreateAccountClick={onCreateAccount}
          />
        </ForgotPasswordWrapper>
      )}
    </TransitionSwitchWrapper>
  );
};

export default ForgotPassword;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
`;

const common_style = {
  marginBottom: '0.75rem',
  marginTop: '0.75rem',
  fontSize: '0.8rem',
};

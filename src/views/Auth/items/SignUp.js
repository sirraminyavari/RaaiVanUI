/**
 *  Sign up page
 */
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import InvisibleIcon from 'components/Icons/InVisible';
import VisibleIcon from 'components/Icons/VisibleIcon';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import { GlobalParams } from 'constant/GlobalParams';
import { decode } from 'js-base64';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import PasswordValidation from '../../../components/PasswordValidation/PasswordValidation';
import CheckPassword from 'utils/Validation/CheckPassword';
import MobileNumberValidator from 'utils/Validation/MobileNumberValidator';
import CreateAccountButtons from './CreateAccountButtons';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';
import SignUpWrapper from './SignUpWrapper';
import VerificationInputWithTimer from 'components/OTP/VerificationInputWithTimer';
import {
  checkUserName,
  createUserToken,
  validateUserCreation,
} from 'apiHelper/ApiHandlers/usersApi';
import { LOGIN_PATH } from 'constant/constants';
import loggedInAction from 'store/actions/auth/loggedInAction';

const { RVDic, RVGlobal, GlobalUtilities } = window;
/**
 * In this page user can create an account with his/her mobile/email.
 */
const SignUp = () => {
  const splitted_terms = RVDic.Checks.YouMustAgreeWithTermsAndConditions.split(
    '[m]'
  );

  const { push } = useHistory();

  const dispatch = useDispatch();

  //If true, the typed password will be shown.
  const [passVisible, setPassVisible] = useState(false);
  //If true, means the password input is focused (to show the Password validation).
  const [passFocused, setPassFocused] = useState(false);

  //true means that sending verification code is in progress
  const [isSending, setIsSending] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  //true means that verification-code component must be rendered
  const [verificationCodeMode, setVerificationCodeMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState();
  const [verificationCodeObject, setVerificationCodeObject] = useState(null);
  const [resetVerificationCode, setResetVerificationCode] = useState();

  //a dictionary of emails that we have checked their availability
  const [emailsDic, setEmailsDic] = useState({});

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [shake, setShake] = useState(0);

  const passwordPolicy = RVGlobal?.PasswordPolicy || {};

  const { routeHistory } = useSelector((state) => ({
    routeHistory: state.auth.routeHistory,
  }));

  // has two responsibilities.
  // 1- when the component did mount, checks password policy, if it is null, will fetch it.
  /*
  useEffect(() => {
    return () => {
      dispatch(setLoginRouteAction(null));
    };
  }, []);
  */

  // By changing routeHistory
  // navigates to the address that routeHistory says.
  /*
  useEffect(() => {
    routeHistory && push(routeHistory);
  }, [routeHistory]);
  */

  //check if the entered email address is valid and available
  const checkAvailability = async (val) => {
    if (!(val || ' ').trim()) return setEmailError('');

    const isEmail = GlobalUtilities.is_valid_email(val);
    const isAvailable =
      isEmail &&
      emailsDic[val] !== false &&
      !(await checkUserName({ UserName: val }));

    if (isEmail) {
      emailsDic[val] = isAvailable;
      setEmailsDic(emailsDic);
    }

    //check this, because the email may has changed during 'checkUserName' running
    if (val !== email) return;

    if (!isEmail) setEmailError(RVDic.Checks.EmailIsNotValid);
    else if (!isAvailable) setEmailError(RVDic.MSG.EmailAlreadyExists);
    else setEmailError('');
  };

  const checkPassword = (val) => {
    setPasswordError(
      !val || CheckPassword(val, passwordPolicy)
        ? ''
        : RVDic.Checks.PasswordPolicyDoesNotMeet
    );
  };

  //Starts the process of registering the user by sending a verification code.
  const onSendVerifyCode = async () => {
    const invalidEmail =
      !GlobalUtilities.is_valid_email(email) && !MobileNumberValidator(email);
    const invalidPassword = !CheckPassword(password, passwordPolicy);
    const invalidFirstName = !firstName.trim();
    const invalidLastName = !lastName.trim();
    const unavailableEmail =
      emailsDic[(email || ' ').trim().toLowerCase()] === false;

    setEmailError(
      invalidEmail
        ? RVDic.Checks.EmailIsNotValid
        : unavailableEmail
        ? RVDic.MSG.EmailAlreadyExists
        : ''
    );

    setPasswordError(
      invalidPassword ? RVDic.Checks.PasswordPolicyDoesNotMeet : ''
    );

    if (
      invalidEmail ||
      invalidPassword ||
      invalidFirstName ||
      invalidLastName ||
      unavailableEmail
    ) {
      setShake(GlobalUtilities.random());
      return;
    }

    setIsSending(true);

    const results = await createUserToken({
      FirstName: firstName.trim(),
      LastName: lastName.trim(),
      Contact: email,
      Password: password,
    });

    setIsSending(false);

    if (results?.ErrorText)
      alert(RVDic.MSG[results.ErrorText] || results.ErrorText, {
        autoClose: 20000,
      });
    else if (results?.VerificationCode) {
      setVerificationCodeMode(true);
      setVerificationCodeObject(results.VerificationCode);
      setResetVerificationCode(GlobalUtilities.random());
    }
  };

  const finalValidation = async (val) => {
    setIsFinalizing(true);

    const results = await validateUserCreation({
      Token: verificationCodeObject?.Token,
      Code: val || verificationCode,
      Login: true,
    });

    setIsFinalizing(false);

    if (results?.ErrorText)
      alert(RVDic.MSG[results.ErrorText] || results.ErrorText);
    else dispatch(loggedInAction(results));
  };

  // Returns user to the login page.
  const onHaveAccount = () => {
    push(LOGIN_PATH + window.location.search);
  };

  const passVisibility = (value) => {
    setPassVisible(value);
    setTimeout(() => setPassFocused(true), 101);
  };

  const handleVerificationCode = (arr, val) => {
    setVerificationCode(val);

    if (String(val || '_').length === verificationCodeObject?.Length)
      finalValidation(val);
  };

  return (
    <TransitionSwitchWrapper
      transitionKey={verificationCodeMode ? 'vr-code' : 'normal'}>
      {verificationCodeMode && (
        <SignUpWrapper>
          <VerificationInputWithTimer
            email={email}
            length={verificationCodeObject?.Length}
            timeout={verificationCodeObject?.Timeout}
            onValueChange={handleVerificationCode}
            resendCodeRequest={onSendVerifyCode}
            loading={isSending}
            reset={resetVerificationCode}
            columnView
          />
          <RowItems style={{ marginTop: '2rem' }}>
            <Button
              style={{
                flex: '0 0 auto',
                marginInlineEnd: '1rem',
                width: '8rem',
              }}
              disable={
                String(verificationCode || 1).length !==
                verificationCodeObject?.Length
              }
              onClick={finalValidation}
              loading={isFinalizing}>
              {RVDic.Confirm}
            </Button>
            <Button
              type="primary-o"
              style={{
                flex: '0 0 auto',
                marginInlineStart: '1rem',
                width: '8rem',
              }}
              onClick={() => setVerificationCodeMode(false)}>
              {RVDic.Return}
            </Button>
          </RowItems>
        </SignUpWrapper>
      )}
      {!verificationCodeMode && (
        <SignUpWrapper>
          <AnimatedInput
            onChange={(v) => setEmail(v)}
            afterChangeListener={(e) =>
              checkAvailability((e?.target?.value || ' ').trim().toLowerCase())
            }
            value={email}
            placeholder={RVDic?.EmailAddress}
            error={emailError}
            shake={shake}
            style={common_style}
          />

          <AnimatedInput
            onChange={(v) => setPassword(v)}
            afterChangeListener={(e) => checkPassword(e?.target?.value)}
            value={password}
            placeholder={RVDic?.Password}
            type={passVisible ? 'text' : 'password'}
            error={passwordError}
            shake={shake}
            style={common_style}
            onBlur={() => setTimeout(() => setPassFocused(false), 100)}
            onFocus={() => setPassFocused(true)}
            children={
              passVisible ? (
                <InvisibleIcon
                  className="rv-gray"
                  style={{ cursor: 'pointer' }}
                  onClick={() => passVisibility(false)}
                />
              ) : (
                <VisibleIcon
                  className="rv-gray"
                  style={{ cursor: 'pointer' }}
                  onClick={() => passVisibility(true)}
                />
              )
            }
          />
          <PasswordValidation
            style={{
              opacity: '0',
              transition: 'opacity 1s',
            }}
            isVisible={passFocused}
            password={password}
            passwordPolicy={passwordPolicy}
          />

          <RowItems>
            <AnimatedInput
              onChange={(v) => setFirstName(v)}
              value={firstName}
              placeholder={RVDic.FirstName}
              shake={shake}
              style={{ marginInlineEnd: '1rem', ...common_style }}
            />
            <AnimatedInput
              onChange={(v) => setLastName(v)}
              value={lastName}
              placeholder={RVDic?.LastName}
              style={{ marginInlineStart: '1rem', ...common_style }}
              shake={shake}
            />
          </RowItems>

          {!passFocused && (
            <Heading
              type="h6"
              style={{
                fontSize: '0.8rem',
                opacity: `${passFocused ? 0 : 1}`,
                transition: 'opacity 1s',
                marginTop: '1rem',
                marginBottom: '1rem',
                textAlign: 'justify',
              }}>
              {splitted_terms[0].replace('[n]', decode(RVGlobal?.SystemName))}
              <a
                href={GlobalParams?.TermsAndConditionsURL}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'blue' }}>
                {RVDic?.TermsAndConditionsOfN.replace(
                  '[n]',
                  decode(RVGlobal?.SystemName)
                )}
              </a>
              {splitted_terms[1]?.replace('[m]', '')}
            </Heading>
          )}

          <Button
            onClick={onSendVerifyCode}
            type="primary"
            loading={isSending}
            disable={
              !email || !password || !firstName.trim() || !lastName.trim()
            }
            style={{
              width: '100%',
              textAlign: 'center',
              ...common_style,
              marginBottom: '2.5rem',
            }}>
            {RVDic?.GetConfirmationCode}
          </Button>

          <CreateAccountButtons
            isVisible={true}
            label={RVDic?.AlreadyHaveAnAccount}
            onCreateAccountClick={onHaveAccount}
          />
        </SignUpWrapper>
      )}
    </TransitionSwitchWrapper>
  );
};

export default SignUp;

export const common_style = {
  marginBottom: '0.75rem',
  marginTop: '0.75rem',
  fontSize: '0.8rem',
};

const RowItems = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

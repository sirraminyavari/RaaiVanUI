/**
 * The forgot password page. Helps the user to reset his/her password.
 */
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import LoadingIconFlat from 'components/Icons/LoadingIcons/LoadingIconFlat';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import sendResetPsswordLinkAction from 'store/actions/auth/sendResetPsswordLinkAction';
import sendResetPsswordTicketAction from 'store/actions/auth/sendResetPsswordTicketAction';
import setCaptchaTokenAction from 'store/actions/auth/setCaptchaToken';
import setEmailAction from 'store/actions/auth/setEmailAction';
import setPasswordAction from 'store/actions/auth/setPassAction';
import signupLoadFilesAction from 'store/actions/auth/signupLoadFilesAction';
import styled from 'styled-components';
import { Box } from '../AuthView.style';
import ContinueWithGoogle from '../elements/ContinueWithGoogle';
import PasswordValidation from '../elements/PasswordValidation';
import InvisibleIcon from 'components/Icons/InVisible';
import VisibleIcon from 'components/Icons/VisibleIcon';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';

const { RVDic } = window;

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { goBack, push } = useHistory();
  // True, if user clicks signUp button.
  const [signUpClicked, setSignUpClicked] = useState(false);
  const [verifyCodeClicked, setVerifyCodeClicked] = useState(false);
  //If true, means the password input is focused(to showing the Password validation).
  const [passFocused, setPassFocused] = useState(false);
  // If true, typed password will be visible
  const [passVisible, setPassVisible] = useState(false);

  const {
    email,
    emailError,
    passwordError,
    isFetching,
    fetchingFiles,
    routeHistory,
    passwordPolicy,
    password,
  } = useSelector((state) => ({
    email: state.auth.email,
    emailError: state.auth.emailError,
    isFetching: state.auth.isFetching,
    fetchingFiles: state.auth.fetchingFiles,
    routeHistory: state.auth.routeHistory,
    passwordPolicy: state.auth.passwordPolicy,
    password: state.auth.password,
    passwordError: state.auth.passwordError,
  }));

  // has two responsibilities.
  // 1- when the component did mount, checks password policy, if it is null, will fetch it.
  // 2- when component will unmount, sets signUpClicked to false.
  // 3- when component will unmount, sets verifyCodeClicked to false.
  useEffect(() => {
    const { GlobalUtilities } = window;

    !passwordPolicy && dispatch(signupLoadFilesAction());
    GlobalUtilities.init_recaptcha((captcha) => {
      captcha.getToken((token) => {
        //use token
        dispatch(setCaptchaTokenAction(token));
      });
    });
    return () => {
      setSignUpClicked(false);
      setVerifyCodeClicked(false);
      dispatch(setLoginRouteAction(null));
    };
  }, []);
  // By changing routeHistory & signUpClicked,
  // navigates to the address that routeHistory says.
  useEffect(() => {
    console.log(signUpClicked, !fetchingFiles, routeHistory, '< *** ***');
    signUpClicked && !fetchingFiles && routeHistory && push(routeHistory);
  }, [routeHistory, signUpClicked, fetchingFiles]);
  useEffect(() => {
    verifyCodeClicked && !isFetching && routeHistory && push(routeHistory);
  }, [verifyCodeClicked, routeHistory]);

  // Sends reset link to inputted email address.
  const onSendResetLink = () => {
    setVerifyCodeClicked(true);
    dispatch(sendResetPsswordTicketAction({ email, password }));
  };
  // Returns the user to the login page.
  const onReturn = () => {
    goBack();
  };
  /**
   * Synchronously sets inputted email/number to redux state.
   * @param {String} value - email input
   */
  const onEmailChanged = (value) => {
    dispatch(setEmailAction(value));
  };
  /**
   * Starts to load sign up necessary files, by dispatching signupLoadFilesAction
   */
  const onCreateAccount = () => {
    setSignUpClicked(true);
    dispatch(setEmailAction(''));
    dispatch(setPasswordAction(''));
    dispatch(signupLoadFilesAction('/auth/register'));
  };
  /**
   * When the password input is focused, the password validator will be shown.
   */
  const onPassFocus = () => {
    setPassFocused(true);
  };
  /**
   * Synchronously sets inputted password to redux state.
   * @param {String} value - password input
   */
  const onPasswordChanged = (value) => {
    dispatch(setPasswordAction(value));
  };
  /**
   * When the password input is blurred, the password validator will be hidden.
   */
  const onPassBlurred = () => {
    setTimeout(() => {
      setPassFocused(false);
    }, 100);
  };

  return (
    <Box>
      {!signUpClicked && fetchingFiles ? (
        <LoadingIconFlat
          style={{
            alignSelf: 'center',
            height: '30vh',
          }}
        />
      ) : (
        <Container onSubmit={onSendResetLink}>
          <Heading
            type="h5"
            className={'rv-distant'}
            style={{
              textAlign: 'center',
              ...common_style,
            }}>
            {RVDic.ForgotMyPassword}
          </Heading>
          <AnimatedInput
            onChange={onEmailChanged}
            value={email}
            placeholder={RVDic.EmailAddress}
            error={emailError}
            shake={emailError && 300}
            style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}
            id={'email'}
          />
          <AnimatedInput
            onChange={onPasswordChanged}
            value={password}
            placeholder={RVDic.NewPassword}
            error={passwordError}
            shake={passwordError && 300}
            style={common_style}
            type={passVisible ? 'text' : 'password'}
            onFocus={onPassFocus}
            onBlur={onPassBlurred}
            id={'password'}
            children={
              passVisible ? (
                <InvisibleIcon
                  className="rv-gray"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setPassVisible(false)}
                />
              ) : (
                <VisibleIcon
                  className="rv-gray"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setPassVisible(true)}
                />
              )
            }
          />
          {passFocused && (
            <PasswordValidation
              style={{
                opacity: '0',
                transition: 'opacity 1s',
              }}
              isVisible={passFocused}
              password={password}
              passwordPolicy={passwordPolicy}
            />
          )}
          {/* <Heading
          type="h6"
          style={{
            fontSize: '0.8rem',
            color: 'grey',
          }}>
          <p>
            {
              'در صورتی که این ایمیل یا شماره موبایل در کلیک‌مایند ثبت شده باشد، کد تایید تغییر رمزعبور برای شما ارسال خواهد شد'
            }
          </p>
        </Heading> */}

          <Button
            onClick={onSendResetLink}
            type="negative"
            loading={isFetching}
            style={{
              width: '100%',
              textAlign: 'center',
              ...common_style,
              marginTop: '1.75rem',
            }}>
            {RVDic.ChangePassword}
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
          <Hiddener isVisible={email.length === 0}>
            <ContinueWithGoogle
              style={{
                marginBottom: '1rem',
                marginTop: '2.5rem',
                width: '100%',
              }}
            />
            <Button
              type="secondary-o"
              style={{ fontSize: '1rem' }}
              loading={fetchingFiles}
              style={{ width: '100%' }}
              style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}
              onClick={onCreateAccount}>
              {RVDic.CreateAccount}
            </Button>
          </Hiddener>
        </Container>
      )}
    </Box>
  );
};

export default ForgotPassword;
const Container = styled.form`
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
const Hiddener = styled.div`
  width: 100%;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  ${({ isVisible }) => (isVisible ? `max-height:100rem` : `max-height:0rem`)};
  transition: opacity 0.7s, max-height 1s;
`;

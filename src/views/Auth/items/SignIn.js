/**
 * Sign in page
 */
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import InvisibleIcon from 'components/Icons/InVisible';
import VisibleIcon from 'components/Icons/VisibleIcon';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import loginAction from 'store/actions/auth/loginAction';
import setEmailAction from 'store/actions/auth/setEmailAction';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';
import setPasswordAction from 'store/actions/auth/setPassAction';
import signupLoadFilesAction from 'store/actions/auth/signupLoadFilesAction';
import styled from 'styled-components';
import { Box } from '../AuthView.style';
import ContinueWithGoogle from '../elements/ContinueWithGoogle';
import LastLoginsModal from '../elements/LastLoginsModal';
import OrgDomains from '../elements/OrgDomains';
import { ToastContainer, toast } from 'react-toastify';

const { RVDic } = window;

const SignIn = () => {
  const dispatch = useDispatch();
  const passRef = useRef();
  const emailRef = useRef();
  const loginRef = useRef();

  const { push } = useHistory();
  // If true, typed password will be visible
  const [passVisible, setPassVisible] = useState(false);
  // When component will unmount, will be 'false' to prevent auto fire of related useEffect.
  const [signUpClicked, setSignUpClicked] = useState(false);
  const [signInClicked, setSignInClicked] = useState(false);
  const [forgotPassClicked, setForgotPassClicked] = useState(false);

  const {
    email,
    emailError,
    password,
    passwordError,
    isFetching,
    fetchingFiles,
    routeHistory,
    lastLoginModal,
  } = useSelector((state) => ({
    email: state.auth.email,
    emailError: state.auth.emailError,
    password: state.auth.password,
    passwordError: state.auth.passwordError,
    isFetching: state.auth.isFetching,
    fetchingFiles: state.auth.fetchingFiles,
    routeHistory: state.auth.routeHistory,
    passwordPolicy: state.auth.passwordPolicy,
    lastLoginModal: state.auth.lastLoginModal,
  }));

  //When component will unmount, will be 'false' to prevent auto fire of related useEffect.
  useEffect(() => {
    emailRef.current?.focus();

    return () => {
      setSignUpClicked(false);
      setSignInClicked(false);
      setForgotPassClicked(false);
      // dispatch(setLoginRouteAction(null));
    };
  }, []);
  //First checks 'sign up' button is clicked or not, then checks routeHistory.
  //It's necessary to prevent auto navigating when component rerenders.
  useEffect(() => {
    (signUpClicked || forgotPassClicked) &&
      !fetchingFiles &&
      routeHistory &&
      push(routeHistory);
  }, [signUpClicked, forgotPassClicked, fetchingFiles]);

  /**
   * Synchronously sets inputted email to redux state.
   * @param {String} value - email input
   */
  const onEmailChanged = (value) => {
    dispatch(setEmailAction(value));
  };
  /**
   * Synchronously sets inputted password to redux state.
   * @param {String} value - password input
   */
  const onPasswordChanged = (value) => {
    dispatch(setPasswordAction(value));
  };
  /**
   * Sends email & password to server by dispatching 'loginAction'
   */
  const onSignIn = () => {
    passRef.current?.blur();
    setSignInClicked(true);
    dispatch(loginAction({ email: email, password: password }));
  };
  /**
   * navigates to resetPassword page.
   */
  const onForgot = () => {
    dispatch(signupLoadFilesAction('/auth/forgotPassword'));
    setForgotPassClicked(true);
    // push('/auth/forgotPassword');
  };
  /**
   * Starts to load sign up necessary files, by dispatching signupLoadFilesAction
   */
  const onCreateAccount = () => {
    setSignUpClicked(true);
    dispatch(setEmailAction(''));
    dispatch(setPasswordAction(''));
    dispatch(signupLoadFilesAction('/auth/register'));
    // push('/auth/register');
  };
  /**
   * When the email input is focused, the password input will be focused.
   */
  const onEmailEnter = () => {
    passRef.current?.focus();
  };
  /**
   * When the password input is focused, the sign in process starts.
   */
  const onPassEnter = () => {
    onSignIn();
  };

  return (
    <Box>
      <Container onSubmit={onSignIn}>
        <Heading
          type="h5"
          style={{
            textAlign: 'center',
            ...common_style,
            marginBottom: '1.75rem',
          }}>
          {RVDic.Login}
        </Heading>
        <AnimatedInput
          onChange={onEmailChanged}
          value={email}
          placeholder={RVDic.EmailAddress}
          error={emailError && true}
          shake={emailError && 300}
          style={common_style}
          id={'email'}
          ref={emailRef}
          enterListener={onEmailEnter}
        />
        <AnimatedInput
          onChange={onPasswordChanged}
          value={password}
          placeholder={RVDic.Password}
          type={passVisible ? 'text' : 'password'}
          error={passwordError}
          shake={passwordError && 300}
          style={common_style}
          id={'password'}
          ref={passRef}
          enterListener={onPassEnter}
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
        {/* <OrgDomains style={common_style} /> */}

        <Button
          onClick={onSignIn}
          // disable={!email || !password}
          type="primary"
          loading={isFetching}
          style={{
            width: '100%',
            textAlign: 'center',
            ...common_style,
            marginTop: '1.75rem',
          }}>
          {RVDic.Login}
        </Button>
        <Button
          type="negative-secondary-o"
          style={{
            width: '100%',
            textAlign: 'center',
            ...common_style,
            marginBottom: '1rem',
          }}
          loading={forgotPassClicked && fetchingFiles}
          onClick={onForgot}>
          {RVDic.ForgotMyPassword}
        </Button>
        <Hiddener isVisible={email.length === 0}>
          <ContinueWithGoogle
            style={{
              marginBottom: '0.5rem',
              marginTop: '2rem',
            }}
          />
          <Button
            type="secondary-o"
            style={{ fontSize: '1rem' }}
            loading={signUpClicked && fetchingFiles}
            style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}
            onClick={onCreateAccount}>
            {RVDic.CreateAccount}
          </Button>
        </Hiddener>
        <LastLoginsModal isVisible={signInClicked && lastLoginModal} />
      </Container>
    </Box>
  );
};
export default SignIn;

const Container = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding-top: 1rem;
`;
const common_style = {
  marginBottom: '0.75rem',
  marginTop: '0.75rem',
  fontSize: '0.8rem',
};
const Hiddener = styled.div`
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  ${({ isVisible }) => (isVisible ? `max-height:100rem` : `max-height:0rem`)};
  transition: opacity 0.7s, max-height 1s;
`;

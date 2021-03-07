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
import setPasswordAction from 'store/actions/auth/setPassAction';
import signupLoadFilesAction from 'store/actions/auth/signupLoadFilesAction';
import styled from 'styled-components';
import ContinueWithGoogle from '../elements/ContinueWithGoogle';
import LastLoginsModal from '../elements/LastLoginsModal';
import OrgDomains from '../elements/OrgDomains';

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

  useEffect(() => {
    console.log(emailRef.current, 'email ref');
    emailRef.current?.focus();
  }, []);
  //When component will unmount, will be 'false' to prevent auto fire of related useEffect.
  useEffect(() => {
    return () => {
      setSignUpClicked(false);
      setSignInClicked(false);
    };
  }, []);
  //First checks 'sign up' button is clicked or not, then checks routeHistory.
  //It's necessary to prevent auto navigating when component rerenders.
  useEffect(() => {
    signUpClicked && routeHistory && push(routeHistory);
  }, [routeHistory, signUpClicked]);

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
    push('/reset_password');
  };
  /**
   * Starts to load sign up necessary files, by dispatching signupLoadFilesAction
   */
  const onCreateAccount = () => {
    setSignUpClicked(true);
    dispatch(signupLoadFilesAction());
  };
  const onEmailEnter = () => {
    passRef.current?.focus();
  };
  const onPassEnter = () => {
    onSignIn();
  };

  return (
    <Container onSubmit={onSignIn}>
      <Heading
        type="h5"
        style={{
          textAlign: 'center',
          ...common_style,
        }}>
        {RVDic.Login}
      </Heading>
      <AnimatedInput
        onChange={onEmailChanged}
        value={email}
        placeholder={RVDic.EmailAddress}
        error={emailError}
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
        type="submit"
        className="rv-red"
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: '1rem',
          ...common_style,
          marginTop: '2rem',
        }}
        ref={loginRef}
        onClick={onForgot}>
        {RVDic.ForgotMyPassword}
      </Button>
      <Button
        onClick={onSignIn}
        type="primary"
        loading={isFetching}
        style={{
          width: '100%',
          textAlign: 'center',
          ...common_style,
        }}>
        {RVDic.Login}
      </Button>
      <ContinueWithGoogle
        style={{
          marginBottom: '1rem',
          marginTop: '1rem',
        }}
      />
      <Button
        type="secondary-o"
        style={{ fontSize: '1rem' }}
        loading={fetchingFiles}
        style={{ width: '100%' }}
        style={common_style}
        onClick={onCreateAccount}>
        {RVDic.SignUp}
      </Button>
      <LastLoginsModal isVisible={signInClicked && lastLoginModal} />
    </Container>
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
  marginBottom: '1rem',
  marginTop: '1rem',
};

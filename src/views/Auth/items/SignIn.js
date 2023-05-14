/**
 * Sign in page
 */
import { RVSizeProp } from '@cliqmind/rv-components';
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import InvisibleIcon from 'components/Icons/InVisible';
import VisibleIcon from 'components/Icons/VisibleIcon';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAuthSlice } from 'store/slice/auth';
import { selectAuth } from 'store/slice/auth/selectors';
import styled from 'styled-components';
import { Box } from '../AuthView.style';
import LastLoginsModal from '../elements/LastLoginsModal';
import CreateAccountButtons from './CreateAccountButtons';

const { RVDic } = window;

const SignIn = () => {
  const dispatch = useDispatch();
  const passRef = useRef();
  const emailRef = useRef();

  const { actions: authActions } = useAuthSlice();

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
    showLastLoginsModal: lastLoginModal,
  } = useSelector(selectAuth);

  //When component will unmount, will be 'false' to prevent auto fire of related useEffect.
  useEffect(() => {
    emailRef?.current?.focus();

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
    dispatch(authActions.setEmail(value));
  };

  /**
   * Synchronously sets inputted password to redux state.
   * @param {String} value - password input
   */
  const onPasswordChanged = (value) => {
    dispatch(authActions.setPassword(value));
  };
  /**
   * Sends email & password to server by dispatching 'loginAction'
   */
  const onSignIn = () => {
    passRef.current?.blur();
    setSignInClicked(true);
    const { GlobalUtilities } = window;
    const reqParams = GlobalUtilities.request_params();
    const invitationId = reqParams?.get_value('inv');

    dispatch(
      authActions.login({
        Username: email || '',
        Password: password || '',
        InvitationID: invitationId,
      })
    );
  };

  /**
   * navigates to resetPassword page.
   */
  const onForgot = () => {
    dispatch(
      authActions.signupLoadFiles({
        destination: '/auth/forgotPassword' + window.location.search,
      })
    );

    setForgotPassClicked(true);
    // push('/auth/forgotPassword');
  };

  /**
   * Starts to load sign up necessary files, by dispatching signupLoadFilesAction
   */
  const onCreateAccount = () => {
    setSignUpClicked(true);
    dispatch(authActions.setEmail(''));
    dispatch(authActions.setPassword(''));
    dispatch(
      authActions.signupLoadFiles({
        destination: '/auth/register' + window.location.search,
      })
    );
    // push('/auth/register');
  };

  /**
   * When the email input is focused, the password input will be focused.
   */
  const onEmailEnter = () => {
    passRef?.current?.focus();
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
          }}
          className=""
        >
          {RVDic?.Login}
        </Heading>
        <AnimatedInput
          onChange={onEmailChanged}
          value={email}
          placeholder={RVDic?.EmailAddress}
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
          placeholder={RVDic?.Password}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
          <Button
            onClick={onSignIn}
            // disable={!email || !password}
            type="primary"
            loading={isFetching}
            style={{
              justifyContent: 'center',
              marginTop: '1.75rem',
            }}
            fullWidth
            size={RVSizeProp.medium}
          >
            {RVDic.Login}
          </Button>
          <Button
            type="negative-secondary-o"
            style={{
              justifyContent: 'center',
            }}
            fullWidth
            size={RVSizeProp.medium}
            loading={forgotPassClicked && fetchingFiles}
            onClick={onForgot}
          >
            <ButtonLabel>{RVDic?.ForgotMyPassword}</ButtonLabel>
          </Button>
          <CreateAccountButtons
            isVisible={true}
            label={RVDic?.CreateAccount}
            onCreateAccountClick={onCreateAccount}
            loading={signUpClicked && fetchingFiles}
          />
        </div>
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
const ButtonLabel = styled.form`
  text-align: center;
  width: 100%;
  display: block;
  text-transform: lowercase;
  &:first-letter {
    text-transform: uppercase;
  }
`;

const common_style = {
  marginBottom: '0.75rem',
  marginTop: '0.75rem',
  fontSize: '0.8rem',
};

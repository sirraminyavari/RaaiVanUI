/**
 * The forgot password page. Helps the user to reset his/her password.
 */
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import sendResetPsswordLinkAction from 'store/actions/auth/sendResetPsswordLinkAction';
import setEmailAction from 'store/actions/auth/setEmailAction';
import signupLoadFilesAction from 'store/actions/auth/signupLoadFilesAction';
import styled from 'styled-components';
import ContinueWithGoogle from '../elements/ContinueWithGoogle';

const { RVDic } = window;

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { goBack, push } = useHistory();
  // True, if user clicks signUp button.
  const [signUpClicked, setSignUpClicked] = useState(false);

  const {
    email,
    emailError,
    isFetching,
    fetchingFiles,
    routeHistory,
  } = useSelector((state) => ({
    email: state.auth.email,
    emailError: state.auth.emailError,
    isFetching: state.auth.isFetching,
    fetchingFiles: state.auth.fetchingFiles,
    routeHistory: state.auth.routeHistory,
    passwordPolicy: state.auth.passwordPolicy,
  }));

  // When component will unmount, sets signUpClicked to false.
  useEffect(() => {
    return () => {
      setSignUpClicked(false);
    };
  }, []);
  // By changing routeHistory & signUpClicked,
  // navigates to the address that routeHistory says.
  useEffect(() => {
    signUpClicked && routeHistory && push(routeHistory);
  }, [routeHistory, signUpClicked]);
  // Sends reset link to inputted email address.
  const onSendResetLink = () => {
    dispatch(sendResetPsswordLinkAction({ email }));
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
    dispatch(signupLoadFilesAction());
  };

  return (
    <Container onSubmit={onSendResetLink}>
      <Heading
        type="h5"
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
        style={common_style}
        id={'email'}
      />
      <Heading
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
      </Heading>

      <Button
        onClick={onSendResetLink}
        type="primary"
        loading={isFetching}
        style={{
          width: '100%',
          textAlign: 'center',
          ...common_style,
        }}>
        {RVDic.GetConfirmationCode}
      </Button>

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
        onClick={onReturn}>
        {RVDic.Return}
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
    </Container>
  );
};

export default ForgotPassword;
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

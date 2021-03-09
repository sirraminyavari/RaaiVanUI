/**
 * Verifying code page
 */
import Heading from 'components/Heading/Heading';
import Edit from 'components/Icons/Edit';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CountDownTimer from '../elements/CountDownTimer';
import VerificationCode from '../elements/VerificationCode';
import { useDispatch, useSelector } from 'react-redux';
import { MAIN_BLUE } from 'const/Colors';
import Button from 'components/Buttons/Button';
import { useHistory } from 'react-router-dom';
import signupAction from 'store/actions/auth/signupAction';
import reSendVerifyCodeAction from 'store/actions/auth/reSendVerifyCodeAction';
import setVerifyCodeAction from 'store/actions/auth/setVerifyCode';

const { RVDic } = window;
/**
 * User by typing the correct verification code, will bring to main page automatically
 */
const ResetPasswordVerifying = () => {
  // True, if the timer finishes.
  const [timerFinished, setTimerFinished] = useState(false);

  const { goBack, push } = useHistory();
  const dispatch = useDispatch();

  const {
    email,
    isFetching,
    verifyCodeToken,
    verifyCode,
    verifyCodeError,
    verifyCodeLength,
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
    verifyCodeToken: state.auth.verifyCodeToken,
    verifyCode: state.auth.verifyCode,
    verifyCodeError: state.auth.verifyCodeError,
    verifyCodeLength: state.auth.verifyCodeLength,
  }));
  useEffect(() => {
    !verifyCodeToken && push('/auth/login');
  }, []);
  // Changing verifyCodeToken means: timer should be reset &
  // reSend button should be disappear.
  useEffect(() => {
    setTimerFinished(false);
  }, [verifyCodeToken]);
  // Fires when timer finishes.
  const onFinished = () => {
    setTimerFinished(true);
  };
  // Fires when the user presses 'sign up' button
  const onSignUp = () => {
    dispatch(signupAction());
  };
  // Resend verification code
  const onReSend = () => {
    dispatch(reSendVerifyCodeAction());
  };
  /**
   * Synchronously sets inputted verification code to redux state.
   * @param {Array<String>} value - verification code input
   */
  const onValueChange = (value) => {
    dispatch(setVerifyCodeAction(value));
  };

  return (
    <Container>
      <Heading
        type="h5"
        style={{
          textAlign: 'center',
          ...common_style,
        }}>
        {RVDic.ForgotMyPassword}
      </Heading>
      <RowItems style={common_style}>
        <Heading
          type="h1"
          style={{
            textAlign: 'center',
            color: 'black',
            ...common_style,
          }}>
          {email}
        </Heading>
        <Edit
          style={{ fontSize: '1.5rem', color: MAIN_BLUE }}
          onClick={goBack}
        />
      </RowItems>
      <Heading type="h3" style={common_style}>
        {
          'لطفاً کد رمز دوم حساب خود را، که به آدرس ایمیل بالا .ارسال شده، در کادر زیر وارد نمایید'
        }
      </Heading>

      <VerificationCode
        error={verifyCodeError}
        length={verifyCodeLength}
        value={verifyCode}
        onValueChange={onValueChange}
        style={{ ...common_style, marginBottom: '3rem' }}
      />
      {timerFinished ? (
        <Button
          onClick={onReSend}
          type="secondary-o"
          loading={isFetching}
          style={{
            width: '100%',
            textAlign: 'center',
            ...common_style,
          }}>
          {RVDic.Resend}
        </Button>
      ) : (
        <CountDownTimer onFinished={onFinished} style={common_style} />
      )}
      <Button
        onClick={onSignUp}
        type="primary"
        loading={isFetching}
        style={{
          width: '100%',
          textAlign: 'center',
          marginTop: '3rem',
          marginBottom: '1rem',
        }}>
        {RVDic.Login}
      </Button>
    </Container>
  );
};
export default ResetPasswordVerifying;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  height: 100%;
  justify-content: space-between;
`;
const RowItems = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  justify-content: space-between;
  width: 100%;
`;
const common_style = {
  marginBottom: '1rem',
  marginTop: '1rem',
};

/**
 * Verifying code page for resetting password
 */
import Heading from 'components/Heading/Heading';
import Edit from 'components/Icons/Edit';
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import OTPCountDownTimer from 'components/OTP/CountDownTimer';
import OTPVerificationInput from 'components/OTP/VerificationInput';
import { useDispatch, useSelector } from 'react-redux';
import { MAIN_BLUE } from 'constant/Colors';
import Button from 'components/Buttons/Button';
import { useHistory } from 'react-router-dom';
import resetPasswordAction from 'store/actions/auth/resetPasswordAction';
import reSendVerifyCodeAction from 'store/actions/auth/reSendVerifyCodeAction';
import setVerifyCodeAction from 'store/actions/auth/setVerifyCode';
import { Box } from '../AuthView.style';
import setCaptchaTokenAction from 'store/actions/auth/setCaptchaToken';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';

const { RVDic } = window;
/**
 * User by typing the correct verification code, will bring to main page automatically
 */
const VerifyingResetPassword = () => {
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
    resendVerifyCodeIsFetching,
    resendCodeTimeout,
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
    resendVerifyCodeIsFetching: state.auth.resendVerifyCodeIsFetching,
    resendCodeTimeout: state.auth.resendVerifyCodeTimeout,
  }));
  // const initFetch = useCallback(() => {
  //   const { GlobalUtilities } = window;
  //   !email && push('/auth/login');

  //   // !verifyCodeToken && push('/auth/login');
  //   GlobalUtilities.init_recaptcha((captcha) => {
  //     captcha.getToken((token) => {
  //       //use token
  //       dispatch(setCaptchaTokenAction(token));
  //     });
  //   });
  // }, [dispatch, email, push]);
  useEffect(() => {
    const { GlobalUtilities } = window;
    !email && push('/auth/login' + window.location.search);

    // !verifyCodeToken && push('/auth/login');
    GlobalUtilities?.init_recaptcha((captcha) => {
      captcha?.getToken((token) => {
        //use token
        dispatch(setCaptchaTokenAction(token));
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const onResetPass = () => {
    dispatch(resetPasswordAction());
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
    console.log(
      value?.filter((x) => x === -1),
      'code '
    );

    dispatch(setVerifyCodeAction(value));
    // Checks if all verification code digits entered,
    // automatically fires 'resetPasswordAction()'
    value?.filter((x) => x === -1)?.length === 0 &&
      dispatch(resetPasswordAction());
  };
  // By clicking on edit button,
  // user will be routed to last screen to edit it's inputted information
  const onEdit = () => {
    dispatch(setLoginRouteAction(null));
    goBack();
  };

  return (
    <Box>
      <Container>
        <Heading
          type="h5"
          style={{
            textAlign: 'center',
            ...common_style,
          }}
          className={'rv-distant'}
        >
          {RVDic?.ForgotMyPassword}
        </Heading>
        <RowItems style={common_style}>
          <Heading
            type="h2"
            style={{
              textAlign: 'center',
              color: 'black',
              ...common_style,
            }}
          >
            {email}
          </Heading>
          <button onClick={onEdit}>
            <Edit style={{ fontSize: '1.5rem', color: MAIN_BLUE }} />
          </button>
        </RowItems>
        <Heading type="h4" style={common_style}>
          {RVDic?.Checks?.PleaseEnterTheVerificationCode}
        </Heading>

        <OTPVerificationInput
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
            loading={resendVerifyCodeIsFetching}
            disable={
              verifyCode
                ? verifyCode?.filter((x) => x === -1)?.length !== 0
                : true
            }
            style={{
              width: '100%',
              textAlign: 'center',
              ...common_style,
            }}
          >
            {RVDic?.Resend}
          </Button>
        ) : (
          <OTPCountDownTimer
            resendCodeTimeout={resendCodeTimeout}
            onFinished={onFinished}
            style={common_style}
          />
        )}
        <Button
          onClick={onResetPass}
          type="primary"
          loading={isFetching}
          style={{
            width: '100%',
            textAlign: 'center',
            marginTop: '3rem',
            marginBottom: '1rem',
          }}
        >
          {RVDic?.Login}
        </Button>
      </Container>
    </Box>
  );
};
export default VerifyingResetPassword;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  height: 100%;
  justify-content: space-between;
  padding-top: 1rem;
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
  marginBottom: '0.75rem',
  marginTop: '0.75rem',
  fontSize: '0.8rem',
};

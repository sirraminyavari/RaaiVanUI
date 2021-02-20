/**
 * A button for resending the verification code.
 */
import TextButton from 'components/Buttons/TextButton';
import { LIGHT_BLUE, MAIN_BLUE } from 'const/Colors';
import { VERIFICATION_CODE } from 'const/LoginRoutes';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import reSendVerifyCodeAction from 'store/actions/auth/reSendVerifyCodeAction';
import styled from 'styled-components';
import CountDownTimer from 'views/Auth/elements/CountDownTimer';
import { UpToDownAnimate } from './Animate.style';

const ResendCode = () => {
  const [resendDisabled, setResendDisabled] = useState(true);
  const dispatch = useDispatch();
  const {
    currentRoute,
    isFetching,
    resendVerifyCodeTotalTimeout,
  } = useSelector((state) => ({
    currentRoute: state.login.currentRoute,
    isFetching: state.login.resendVerifyCodeIsFetching,
    resendVerifyCodeTotalTimeout: state.login.resendVerifyCodeTotalTimeout,
  }));

  useEffect(() => {
    if (resendVerifyCodeTotalTimeout < 0) {
      setResendDisabled(true);
    }
  }, [resendVerifyCodeTotalTimeout]);

  /**
   * According to 'currentRoute'
   * this function decides to return true or false.
   */
  const isVisible = () => {
    switch (currentRoute) {
      case VERIFICATION_CODE:
        return true;
      default:
        return false;
    }
  };
  /**
   * By clicking button,
   * this will fire and verification code will resend.
   */
  const onResend = () => {
    dispatch(reSendVerifyCodeAction());
  };
  /**
   * By finishing the timer, will fire.
   */
  const onFinished = () => {
    setResendDisabled(false);
  };
  return (
    <UpToDownAnimate
      style={{ marginTop: '3rem', marginBottom: '3rem' }}
      isVisible={isVisible()}>
      <Container>
        {resendDisabled && resendVerifyCodeTotalTimeout > 0 ? (
          <CountDownTimer onFinished={onFinished} />
        ) : (
          <TextButton
            onClick={onResend}
            disabled={resendDisabled}
            isFetching={isFetching}
            style={{
              flexDirection: 'row',
              display: 'flex',
              alignSelf: 'right',
              color: resendDisabled ? LIGHT_BLUE : MAIN_BLUE,
            }}>
            {'ارسال مجدد کد'}
          </TextButton>
        )}
      </Container>
    </UpToDownAnimate>
  );
};

export default ResendCode;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  align-self: center;
  justify-content: center;
`;

/**
 * A component for navigating the user to process to reset his/her account password
 */
import Button from 'components/Buttons/Button';
import TextButton from 'components/Buttons/TextButton';
import { LIGHT_BLUE, RED } from 'const/Colors';
import { FORGOT_PASSWORD, SIGN_IN, SIGN_IN_COLLAPSED } from 'const/LoginRoutes';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';
import styled from 'styled-components';
import { UpToDownAnimate } from './Animate.style';

const { RVDic } = window;

const ForgotPassword = () => {
  const dispatch = useDispatch();

  // We use ref to pass component dimension to 'UpToDownAnimate'
  const ref = useRef();

  const { currentRoute } = useSelector((state) => ({
    currentRoute: state.auth.currentRoute,
  }));

  /**
   * According to 'currentRoute'
   * this function decides to return true or false.
   */
  const isVisible = () => {
    switch (currentRoute) {
      case SIGN_IN:
      case SIGN_IN_COLLAPSED:
        return true;
      default:
        return false;
    }
  };
  /**
   * By clicking this, user can enter his/her email, the reset link will send to him/her
   */
  const onForgot = () => {
    dispatch(setLoginRouteAction(FORGOT_PASSWORD));
  };

  return (
    <UpToDownAnimate
      ref={ref}
      isVisible={isVisible()}
      dimension={ref?.current?.getBoundingClientRect()}
      style={{ flexGrow: '0.8', marginTop: '1.5rem' }}>
      <Container>
        {/* <TextButton
          style={{ fontSize: '1rem' }}
          className="rv-red"
          onClick={onForgot}>
          {RVDic.ForgotMyPassword}
        </TextButton> */}

        <Button
          type="secondary-o"
          style={{ fontSize: '1rem' }}
          className="rv-red"
          style={{ width: '100%', textAlign: 'center' }}
          onClick={onForgot}>
          {RVDic.ForgotMyPassword}
        </Button>
        <div
          style={{
            height: '1px',
            width: '100%',
            backgroundColor: `${LIGHT_BLUE}`,
            marginTop: '4rem',
          }}
        />
      </Container>
    </UpToDownAnimate>
  );
};

export default ForgotPassword;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

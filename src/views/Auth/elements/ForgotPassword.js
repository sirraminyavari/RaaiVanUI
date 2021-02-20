/**
 * A component for navigating the user to procedure to reset his/her account password
 */
import TextButton from 'components/Buttons/TextButton';
import { LIGHT_BLUE, RED } from 'const/Colors';
import { FORGOT_PASSWORD, SIGN_IN, SIGN_IN_COLLAPSED } from 'const/LoginRoutes';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';
import styled from 'styled-components';
import { UpToDownAnimate } from './Animate.style';

const { RVDic } = window;

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { currentRoute } = useSelector((state) => ({
    currentRoute: state.login.currentRoute,
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
      isVisible={isVisible()}
      style={{ flexGrow: '0.8', marginTop: '1.5rem' }}>
      <Container>
        <TextButton
          style={{ fontSize: '1rem' }}
          className="rv-red"
          onClick={onForgot}>
          {RVDic.ForgotMyPassword}
        </TextButton>
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
  width: 100%;
`;

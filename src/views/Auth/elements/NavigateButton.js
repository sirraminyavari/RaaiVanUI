import LoadingButton from 'components/Buttons/LoadingButton';
import { MAIN_BLUE, MAIN_BLUE_HOVER, RED, RED_HOVER } from 'const/Colors';
import {
  FORGOT_PASSWORD,
  RESET_PASSWORD_SENT,
  SIGN_IN,
  SIGN_IN_COLLAPSED,
  SIGN_UP_EMAIL,
  SIGN_UP_EMAIL_COLLAPSED,
  SIGN_UP_PASSWORD,
  SIGN_UP_SUCCESS,
} from 'const/LoginRoutes';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setLoginRoute from 'store/actions/auth/loginRouteAction';
import styled, { ThemeProvider } from 'styled-components';
import { UpToDownAnimate } from './Animate.style';

const NavigateButton = () => {
  const dispatch = useDispatch();
  const { currentRoute, email } = useSelector((state) => ({
    email: state.login.email,
    currentRoute: state.loginRoute.currentRoute,
  }));
  const buttonTitle = (currentRoute) => {
    switch (currentRoute) {
      case SIGN_IN:
      case SIGN_IN_COLLAPSED:
        return { label: 'ورود', bgColor: MAIN_BLUE, hover: MAIN_BLUE_HOVER };
      case SIGN_UP_EMAIL:
      case SIGN_UP_EMAIL_COLLAPSED:
        return {
          label: 'مرحله بعدی',
          bgColor: MAIN_BLUE,
          hover: MAIN_BLUE_HOVER,
        };
      case SIGN_UP_PASSWORD:
        return { label: 'ثبت نام', bgColor: MAIN_BLUE, hover: MAIN_BLUE_HOVER };
      case FORGOT_PASSWORD:
        return { label: 'ارسال لینک', bgColor: RED, hover: RED_HOVER };
      case RESET_PASSWORD_SENT:
      case SIGN_UP_SUCCESS:
        return {
          label: 'صفحه ورود به کلیک مایند',
          bgColor: MAIN_BLUE,
          hover: MAIN_BLUE_HOVER,
        };
      default:
        return false;
    }
  };

  const onNavigate = () => {
    console.log('###');
    let destination = '';
    switch (currentRoute) {
      case SIGN_UP_EMAIL:
      case SIGN_UP_EMAIL_COLLAPSED:
        destination = SIGN_UP_PASSWORD;
        break;
      case SIGN_UP_PASSWORD:
        destination = SIGN_UP_SUCCESS;
        break;
      case FORGOT_PASSWORD:
        destination = RESET_PASSWORD_SENT;
        break;
      case RESET_PASSWORD_SENT:
      case SIGN_UP_SUCCESS:
        destination = SIGN_IN;
        break;
    }

    dispatch(setLoginRoute(destination));
  };

  return (
    <UpToDownAnimate isVisible={true} style={{ padding: '0.4rem' }}>
      {/* <ThemeProvider theme={theme}> */}
      <LoadingButton
        onClick={onNavigate}
        label={buttonTitle(currentRoute).label}
        background={buttonTitle(currentRoute).bgColor}
        backgroundHover={buttonTitle(currentRoute).hover}
      />
      {/* </ThemeProvider> */}
    </UpToDownAnimate>
  );
};
const Animator = styled.div`
  background-color: ${({ isVisible }) => (isVisible ? 'red' : 'white')};
  transform: translateX(200px);
  width: ${({ isVisible }) => (isVisible ? 'auto' : 0)};
  transition: width 1s, background-color 1s;
`;

export default NavigateButton;

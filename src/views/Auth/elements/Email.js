import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import setEmailAction from 'store/actions/auth/setEmailAction';
import { UpToDownAnimate } from './Animate.style';
import {
  FORGOT_PASSWORD,
  SIGN_IN,
  SIGN_IN_COLLAPSED,
  SIGN_UP_EMAIL,
  SIGN_UP_EMAIL_COLLAPSED,
  SIGN_UP_PASSWORD,
} from 'const/LoginRoutes';

const Email = () => {
  const dispatch = useDispatch();
  const isVisible = (currentRoute) => {
    switch (currentRoute) {
      case SIGN_IN:
      case SIGN_IN_COLLAPSED:
      case SIGN_UP_EMAIL:
      case SIGN_UP_EMAIL_COLLAPSED:
      case SIGN_UP_PASSWORD:
      case FORGOT_PASSWORD:
        return true;
      default:
        return false;
    }
  };
  const { currentRoute, email } = useSelector((state) => ({
    email: state.login.email,
    currentRoute: state.loginRoute.currentRoute,
  }));
  useEffect(() => {
    console.log(currentRoute, '<***');
  }, [currentRoute]);
  const onEmailChanged = (value) => {
    dispatch(setEmailAction(value));
  };

  return (
    <UpToDownAnimate isVisible={isVisible(currentRoute)}>
      <AnimatedInput
        onChange={onEmailChanged}
        value={email}
        placeholder={'آدرس ایمیل'}
      />
    </UpToDownAnimate>
  );
};

export default Email;

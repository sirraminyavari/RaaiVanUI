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
import setPassword from 'store/actions/auth/setPassAction';

const Password = () => {
  const dispatch = useDispatch();
  const isVisible = (currentRoute) => {
    switch (currentRoute) {
      case SIGN_IN:
      case SIGN_IN_COLLAPSED:
      case SIGN_UP_PASSWORD:
        return true;
      default:
        return false;
    }
  };
  const { currentRoute, password } = useSelector((state) => ({
    password: state.login.password,
    currentRoute: state.loginRoute.currentRoute,
  }));
  useEffect(() => {
    console.log(password, '<***');
  }, [currentRoute]);
  const onPasswordChanged = (value) => {
    dispatch(setPassword(value));
  };

  return (
    <UpToDownAnimate isVisible={isVisible(currentRoute)}>
      <AnimatedInput
        onChange={onPasswordChanged}
        value={password}
        placeholder={'رمز عبور'}
        type={'password'}
      />
    </UpToDownAnimate>
  );
};

export default Password;

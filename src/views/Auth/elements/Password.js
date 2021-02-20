/**
 * A component for inputting the password
 */
import AnimatedInput from 'components/Inputs/AnimatedInput';
import {
  RESET_PASSWORD,
  SIGN_IN,
  SIGN_IN_COLLAPSED,
  SIGN_UP_EMAIL,
} from 'const/LoginRoutes';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setPassword from 'store/actions/auth/setPassAction';
import setPasswordFocusAction from 'store/actions/auth/setPasswordFocusAction';
import { UpToDownAnimate } from './Animate.style';

const { RVDic } = window;

const Password = () => {
  const dispatch = useDispatch();
  /**
   * According to 'currentRoute'
   * this function decides to return true or false.
   */
  const isVisible = () => {
    switch (currentRoute) {
      case SIGN_IN:
      case SIGN_IN_COLLAPSED:
      case SIGN_UP_EMAIL:
      case RESET_PASSWORD:
        return true;
      default:
        return false;
    }
  };

  const { currentRoute, password, passwordError } = useSelector((state) => ({
    password: state.login.password,
    passwordError: state.login.passwordError,
    currentRoute: state.login.currentRoute,
  }));
  /**
   * Synchronously set user inputted value to Redux state
   * @param {String} value - inputted user passowrd
   */
  const onPasswordChanged = (value) => {
    dispatch(setPassword(value));
  };

  /**
   * sets isPasswordFocused = True on redux state
   * if user focuses on password field
   */
  const onFocus = () => {
    // setPassFocused(true);
    dispatch(setPasswordFocusAction(true));
  };
  /**
   * sets isPasswordFocused = False on redux state
   * if user defocuses on password field
   */
  const onBlur = () => {
    // setPassFocused(false);
    dispatch(setPasswordFocusAction(false));
  };

  return (
    <>
      <UpToDownAnimate isVisible={isVisible()} style={{ marginTop: '1.5rem' }}>
        <AnimatedInput
          onChange={onPasswordChanged}
          value={password}
          placeholder={RVDic.Password}
          type={'password'}
          error={passwordError}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </UpToDownAnimate>
      {/* <PasswordValidation passFocused={passFocused} /> */}
    </>
  );
};

export default Password;

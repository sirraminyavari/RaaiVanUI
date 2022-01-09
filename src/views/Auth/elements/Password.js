/**
 * A component for inputting the password
 */
import InvisibleIcon from 'components/Icons/InVisible';
import VisibleIcon from 'components/Icons/VisibleIcon';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import {
  RESET_PASSWORD,
  SIGN_IN,
  SIGN_IN_COLLAPSED,
  SIGN_UP_EMAIL,
} from 'constant/LoginRoutes';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setPassword from 'store/actions/auth/setPassAction';
import setPasswordFocusAction from 'store/actions/auth/setPasswordFocusAction';
import { UpToDownAnimate } from './Animate.style';
const { RVDic, GlobalUtilities } = window;

const Password = () => {
  const dispatch = useDispatch();

  // We use ref to pass component dimension to 'UpToDownAnimate'
  const ref = useRef();

  // If TRUE, typed password will be visible,
  const [passVisible, setPassVisible] = useState(false);

  const { currentRoute, password, passwordError } = useSelector((state) => ({
    password: state.auth.password,
    passwordError: state.auth.passwordError,
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
      case SIGN_UP_EMAIL:
      case RESET_PASSWORD:
        return true;
      default:
        return false;
    }
  };

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
    dispatch(setPasswordFocusAction(true));
  };
  /**
   * sets isPasswordFocused = False on redux state
   * if user defocuses on password field
   */
  const onBlur = () => {
    setTimeout(() => {
      dispatch(setPasswordFocusAction(true));
    }, 100);
  };

  return (
    <UpToDownAnimate
      ref={ref}
      isVisible={isVisible()}
      dimension={ref?.current?.getBoundingClientRect()}
      style={{ marginTop: '1.5rem' }}>
      <AnimatedInput
        onChange={onPasswordChanged}
        value={password}
        placeholder={RVDic.Password}
        type={passVisible ? 'text' : 'password'}
        error={passwordError}
        shake={!passwordError ? false : GlobalUtilities.random()}
        onFocus={onFocus}
        onBlur={onBlur}
        children={
          passVisible ? (
            <InvisibleIcon
              className="rv-gray"
              style={{ cursor: 'pointer' }}
              onClick={() => setPassVisible(false)}
            />
          ) : (
            <VisibleIcon
              className="rv-gray"
              style={{ cursor: 'pointer' }}
              onClick={() => setPassVisible(true)}
            />
          )
        }
      />
    </UpToDownAnimate>
  );
};

export default Password;

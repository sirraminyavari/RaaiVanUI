/**
 * A component for inputting email or mobile.
 */
import AnimatedInput from 'components/Inputs/AnimatedInput';
import {
  FORGOT_PASSWORD,
  SIGN_IN,
  SIGN_IN_COLLAPSED,
  SIGN_UP_EMAIL,
  SIGN_UP_EMAIL_COLLAPSED,
  SIGN_UP_PASSWORD,
  VERIFICATION_CODE,
} from 'const/LoginRoutes';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setEmailAction from 'store/actions/auth/setEmailAction';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';
import { UpToDownAnimate } from './Animate.style';

const { RVDic } = window;

const Email = () => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { currentRoute, email, emailError } = useSelector((state) => ({
    email: state.login.email,
    emailError: state.login.emailError,
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
      case SIGN_UP_EMAIL:
      case SIGN_UP_EMAIL_COLLAPSED:
      case SIGN_UP_PASSWORD:
      case FORGOT_PASSWORD:
      case VERIFICATION_CODE:
        return true;
      default:
        return false;
    }
  };
  /**
   * According to 'currentRoute'
   * This function decides to makes email input editable or not.
   * If True, the user should click the edit button to be able to edit the inputted email/mobile
   */
  const editable = () => {
    switch (currentRoute) {
      case SIGN_UP_PASSWORD:
      case VERIFICATION_CODE:
        return true;
      default:
        return false;
    }
  };
  /**
   * Synchronously set user inputted value to Redux state
   * @param {String} value - inputted user email/mobile
   */
  const onEmailChanged = (value) => {
    dispatch(setEmailAction(value));
  };
  /**
   * Navigates user to previous screen to edit it's inputted email/mobile
   */
  const onEditEmail = () => {
    dispatch(setLoginRouteAction(SIGN_UP_EMAIL));
  };
  /**
   * According to 'currentRoute'
   * user can edit inputted email/mobile or not.
   */
  const diabledEmail = () => {
    return currentRoute === SIGN_UP_PASSWORD;
  };

  return (
    <UpToDownAnimate
      ref={ref}
      tabIndex="1"
      isVisible={isVisible()}
      id="email"
      style={{ marginTop: '2.5rem' }}>
      <AnimatedInput
        onChange={onEmailChanged}
        value={email}
        placeholder={RVDic.EmailAddress}
        editable={editable()}
        onEdit={onEditEmail}
        disabled={diabledEmail()}
        error={emailError}
        z
      />
    </UpToDownAnimate>
  );
};

export default Email;

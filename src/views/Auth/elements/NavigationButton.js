/**
 * A component, for handling the navigation
 */
import LoadingButton from 'components/Buttons/LoadingButton';
import { RED, RED_HOVER } from 'const/Colors';
import {
  FORGOT_PASSWORD,
  RESET_PASSWORD_SENT,
  SIGN_IN,
  SIGN_IN_COLLAPSED,
  SIGN_UP_EMAIL,
  SIGN_UP_EMAIL_COLLAPSED,
  SIGN_UP_PASSWORD,
  SIGN_UP_SUCCESS,
  VERIFICATION_CODE,
} from 'const/LoginRoutes';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import loginAction from 'store/actions/auth/loginAction';
import sendResetPsswordLinkAction from 'store/actions/auth/sendResetPsswordLinkAction';
import sendVerifyCodeAction from 'store/actions/auth/sendVerifyCodeAction';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';
import signupAction from 'store/actions/auth/signupAction';
import { UpToDownAnimate } from './Animate.style';

const { RVDic } = window;
const NavigationButton = () => {
  const dispatch = useDispatch();
  const {
    currentRoute,
    email,
    password,
    isFetching,
    name,
    family,
    passwordPolicy,
  } = useSelector((state) => ({
    email: state.login.email,
    password: state.login.password,
    currentRoute: state.login.currentRoute,
    isFetching: state.login.isFetching,
    name: state.login.name,
    family: state.login.family,
    passwordPolicy: state.login.passwordPolicy,
  }));
  const disabledButton = () => {};
  /**
   * According to 'currentRoute', button has different title.
   */
  const buttonTitle = (currentRoute) => {
    switch (currentRoute) {
      case SIGN_IN:
      case SIGN_IN_COLLAPSED:
        return {
          label: RVDic.Login,

          class: 'rv-air-button-warm-blue',
        };
      case SIGN_UP_EMAIL:
      case SIGN_UP_EMAIL_COLLAPSED:
        return {
          label: RVDic.GetConfirmationCode,
          class: 'rv-air-button-warm-blue',
        };
      case SIGN_UP_PASSWORD:
        return {
          label: RVDic.SignUp,

          class: 'rv-air-button-warm-blue',
        };
      case FORGOT_PASSWORD:
        return { label: RVDic.Send, bgColor: RED, hover: RED_HOVER };
      case RESET_PASSWORD_SENT:
      case SIGN_UP_SUCCESS:
        return {
          label: 'صفحه ورود به کلیک مایند',

          class: 'rv-air-button-warm-blue',
        };
      case VERIFICATION_CODE:
        return {
          label: 'مرحله بعدی',
          class: 'rv-air-button-warm-blue',
        };
      default:
        return false;
    }
  };
  /**
   * By clicking the user,
   * According to 'currentRoute',
   * this function decides to navigate user to suitable route.
   */
  const onNavigate = () => {
    switch (currentRoute) {
      case SIGN_IN:
        // dispatch(verificationAction());
        dispatch(loginAction({ email: email, password: password }));

        break;
      case SIGN_IN_COLLAPSED:
        // dispatch(
        // loginAction({ userName: encode(email), password: encode(password) })
        // );

        break;
      case SIGN_UP_EMAIL:
      case SIGN_UP_EMAIL_COLLAPSED:
        dispatch(
          sendVerifyCodeAction({
            email,
            password,
            name,
            family,
            passwordPolicy,
          })
        );

        break;
      case VERIFICATION_CODE:
        dispatch(signupAction());

        break;
      case FORGOT_PASSWORD:
        dispatch(sendResetPsswordLinkAction({ email }));

        break;
      case RESET_PASSWORD_SENT:
      case SIGN_UP_SUCCESS:
        dispatch(setLoginRouteAction(SIGN_IN));

        break;
    }
  };
  const login = () => {
    const { isAuthenticated, RVAPI, GlobalUtilities } = window;
    isAuthenticated = true;
  };

  return (
    <UpToDownAnimate
      isVisible={true}
      style={{ padding: '0.4rem', marginTop: '2rem' }}>
      <LoadingButton
        onClick={onNavigate}
        isFetching={isFetching}
        className={buttonTitle(currentRoute).class}
        disabled={disabledButton()}>
        {buttonTitle(currentRoute).label}
      </LoadingButton>
    </UpToDownAnimate>
  );
};

export default NavigationButton;

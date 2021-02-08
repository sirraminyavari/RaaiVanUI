import TextButton from 'components/Buttons/TextButton';
import { RED } from 'const/Colors';
import { FORGOT_PASSWORD, SIGN_IN, SIGN_IN_COLLAPSED } from 'const/LoginRoutes';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setLoginRoute from 'store/actions/auth/loginRouteAction';
import { UpToDownAnimate } from './Animate.style';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const isVisible = (currentRoute) => {
    switch (currentRoute) {
      case SIGN_IN:
      case SIGN_IN_COLLAPSED:
        return true;
      default:
        return false;
    }
  };
  const { currentRoute } = useSelector((state) => ({
    currentRoute: state.loginRoute.currentRoute,
  }));
  const onForgot = () => {
    dispatch(setLoginRoute(FORGOT_PASSWORD));
  };

  return (
    <UpToDownAnimate
      isVisible={isVisible(currentRoute)}
      style={{ flexGrow: '0.8' }}>
      <TextButton
        label={'!' + 'رمز عبور را فراموش کرده ام'}
        style={{ color: `${RED}`, fontSize: '1rem' }}
        onClick={onForgot}
      />
    </UpToDownAnimate>
  );
};

export default ForgotPassword;

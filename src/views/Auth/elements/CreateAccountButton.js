/**
 * A component for navigating the user to create an account route.
 */
import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import loginRoute from 'store/actions/auth/loginRouteAction';
import { UpToDownAnimate } from './Animate.style';
import {
  SIGN_IN,
  FORGOT_PASSWORD,
  SIGN_UP_EMAIL,
  SIGN_UP_PASSWORD,
} from 'const/LoginRoutes';
import { Flipper, Flipped } from 'react-flip-toolkit';

/**
 * Due to the currentRoute title of this button will change,
 * its routing will also change.
 */
const CreateAccountButton = ({ ...props }) => {
  const dispatch = useDispatch();
  const { currentRoute, email } = useSelector((state) => ({
    currentRoute: state.loginRoute.currentRoute,
    email: state.login.email,
  }));
  const title =
    currentRoute === SIGN_IN ? 'ایجاد حساب کاربری جدید' : '!حساب کاربری دارم';

  const isVisible = (currentRoute) => {
    switch (currentRoute) {
      case FORGOT_PASSWORD:
      case SIGN_IN:
        return email.length === 0;
      case SIGN_UP_EMAIL:
      case SIGN_UP_PASSWORD:
        return true;

      default:
        return false;
    }
  };

  const onCreate = () => {
    dispatch(loginRoute(currentRoute === SIGN_IN ? SIGN_UP_EMAIL : SIGN_IN));
  };

  return (
    <UpToDownAnimate
      isVisible={isVisible(currentRoute)}
      style={{ marginBottom: '0.8rem' }}>
      <Container {...props} onClick={onCreate}>
        {title}
      </Container>
    </UpToDownAnimate>
  );
};

export default CreateAccountButton;

const Container = styled.button`
  color: #2b7be4;
  align-self: center;
  text-align: center;
`;

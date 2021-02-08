import TextButton from 'components/Buttons/TextButton';
import {
  FORGOT_PASSWORD,
  RESET_PASSWORD_SENT,
  SIGN_IN,
} from 'const/LoginRoutes';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setLoginRoute from 'store/actions/auth/loginRouteAction';
import styled from 'styled-components';
import { UpToDownAnimate } from './Animate.style';

const Return = () => {
  const dispatch = useDispatch();
  const isVisible = (currentRoute) => {
    switch (currentRoute) {
      case FORGOT_PASSWORD:
        return true;

      default:
        return false;
    }
  };
  const { currentRoute } = useSelector((state) => ({
    currentRoute: state.loginRoute.currentRoute,
  }));

  const onReturn = () => {
    console.log('change route');
    dispatch(setLoginRoute(SIGN_IN));
  };

  return (
    <UpToDownAnimate isVisible={isVisible(currentRoute)}>
      <TextButton onClick={onReturn} label={'بازگشت'}></TextButton>
    </UpToDownAnimate>
  );
};
const Animator = styled.div`
  background-color: ${({ isVisible }) => (isVisible ? 'red' : 'white')};
  transform: translateX(200px);
  width: ${({ isVisible }) => (isVisible ? 'auto' : 0)};
  transition: width 1s, background-color 1s;
`;

export default Return;

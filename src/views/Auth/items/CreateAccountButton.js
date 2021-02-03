/**
 * A component for navigating the user to create an account route.
 */
import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import loginRoute from 'store/actions/auth/loginRouteAction';

/**
 * Due to the currentRoute title of this button will change,
 * its routing will also change.
 */
const CreateAccountButton = () => {
  const dispatch = useDispatch();
  const { currentRoute } = useSelector((state) => state.loginRoute);
  const title =
    currentRoute === 'login' ? 'ایجاد حساب کاربری جدید' : '!حساب کاربری دارم';

  return (
    <Container
      onClick={() => {
        dispatch(
          loginRoute(currentRoute.includes('signup') ? 'login' : 'signup_email')
        );
      }}>
      {title}
    </Container>
  );
};

export default CreateAccountButton;

const Container = styled.button`
  color: #2b7be4;
  align-self: center;
  text-align: center;
`;

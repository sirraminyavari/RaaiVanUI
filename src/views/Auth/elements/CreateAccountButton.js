/**
 * A button for creating a new account.
 */
import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import loginRoute from 'store/actions/auth/setLoginRouteAction';
import { UpToDownAnimate } from './Animate.style';
import {
  SIGN_IN,
  FORGOT_PASSWORD,
  SIGN_UP_EMAIL,
  SIGN_UP_PASSWORD,
} from 'const/LoginRoutes';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';
import signupLoadFilesAction from 'store/actions/auth/signupLoadFilesAction';
import Loader from 'components/Loader/Loader';

const { RVDic } = window;
/**
 * By clicking this button, user will able to start signing up procedure.
 * @param {object} props - Other params that don't include above.
 */
const CreateAccountButton = ({ ...props }) => {
  const dispatch = useDispatch();
  const { currentRoute, email, fetchingFiles } = useSelector((state) => ({
    currentRoute: state.login.currentRoute,
    email: state.login.email,
    fetchingFiles: state.login.fetchingFiles,
  }));
  // Button title in sign-in page is different with other pages.
  const title = currentRoute === SIGN_IN ? RVDic.SignUp : '!حساب کاربری دارم';
  /**
   * According to 'currentRoute'
   * this function decides to return true or false.
   */
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
  /**
   * In 'sign in' page, touching button, navigates to 'sign-up' steps.
   * In other pages, touching button, navigates to 'sign-in' page.
   */
  const onCreate = () => {
    currentRoute === SIGN_IN
      ? dispatch(signupLoadFilesAction())
      : dispatch(setLoginRouteAction(SIGN_IN));
  };

  return (
    <UpToDownAnimate
      isVisible={isVisible(currentRoute)}
      style={{ marginTop: '1.5rem' }}>
      {fetchingFiles ? (
        <Loader />
      ) : (
        <Container {...props} onClick={onCreate}>
          {title}
        </Container>
      )}
    </UpToDownAnimate>
  );
};

export default CreateAccountButton;

const Container = styled.button`
  color: #2b7be4;
  align-self: center;
  text-align: center;
`;

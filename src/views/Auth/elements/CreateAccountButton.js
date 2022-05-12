/**
 * A button for creating a new account.
 */
import Button from 'components/Buttons/Button';
import {
  FORGOT_PASSWORD,
  SIGN_IN,
  SIGN_IN_COLLAPSED,
  SIGN_UP_EMAIL,
  SIGN_UP_PASSWORD,
} from 'constant/LoginRoutes';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';
import signupLoadFilesAction from 'store/actions/auth/signupLoadFilesAction';
import styled from 'styled-components';
import { UpToDownAnimate } from './Animate.style';

const { RVDic } = window;
/**
 * By clicking this button, user will able to start signing up process.
 * @param {object} props - Other params that don't include above.
 */
const CreateAccountButton = ({ ...props }) => {
  const dispatch = useDispatch();

  // We use ref to pass component dimension to 'UpToDownAnimate'
  const ref = useRef();

  const { currentRoute, email, fetchingFiles } = useSelector((state) => ({
    currentRoute: state.auth.currentRoute,
    email: state.auth.email,
    fetchingFiles: state.auth.fetchingFiles,
  }));

  // Button title in sign-in page is different with other pages.
  const title = () => {
    switch (currentRoute) {
      case SIGN_IN:
      case SIGN_IN_COLLAPSED:
      case FORGOT_PASSWORD:
        return RVDic.SignUp;
      default:
        return '!حساب کاربری دارم';
    }
  };
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
    switch (currentRoute) {
      case SIGN_IN:
      case SIGN_IN_COLLAPSED:
      case FORGOT_PASSWORD:
        dispatch(signupLoadFilesAction());
      default:
        dispatch(setLoginRouteAction(SIGN_IN));
    }
  };

  return (
    // <UpToDownAnimate
    //   ref={ref}
    //   dimension={ref?.current?.getBoundingClientRect()}
    //   isVisible={isVisible(currentRoute)}
    //   style={{ marginTop: '1.5rem' }}>

    <Button
      type="secondary-o"
      style={{ fontSize: '1rem' }}
      loading={fetchingFiles}
      style={{ width: '100%' }}
      onClick={onCreate}
    >
      {title()}
    </Button>
    // </UpToDownAnimate>
  );
};

export default CreateAccountButton;

const Container = styled.button`
  color: #2b7be4;
  align-self: center;
  text-align: center;
`;

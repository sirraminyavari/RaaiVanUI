/**
 * A component for signup on ClickMind
 */
import LoadingButton from 'components/Buttons/LoadingButton';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import loginRoute from 'store/actions/auth/loginRouteAction';
import setEmailAction from 'store/actions/auth/signup/setEmailAction';
import setPasswordAction from 'store/actions/auth/signup/setPassAction';
import styled from 'styled-components';
import AcceptTerms from './items/AcceptTerms';
import EnteredEmail from './items/EnteredEmail';
import SignInMethods from './items/SignInMethods';

/**
 * It has two-step routing inside itself,
 * first step for entering email and
 * second step for entering the password
 */
const Signup = () => {
  const [emailError, setEmailError] = useState(false);
  // It's true if email value length is equal to zero.
  const [passError, setPassError] = useState(false);
  // It's true if password value length is equal to zero.

  const { email, password } = useSelector((state) => state.signup);
  const { currentRoute } = useSelector((state) => state.loginRoute);

  const dispatch = useDispatch();

  useEffect(() => {
    email.length > 0 && setEmailError(false);
    password.length > 0 && setPassError(false);
  }, [email, password]);

  /**
   * Due to using a button for two targets, this function checks the current route by `currentRoute`,
   * then according to currentRoute checks the password length or email length,
   * after that goes to the next step
   */
  const nextStep = () => {
    if (currentRoute === 'signup_email' && email.length === 0) {
      setEmailError(true);
    } else if (currentRoute === 'signup_password' && password.length === 0) {
      setPassError(true);
    } else {
      dispatch(
        loginRoute(currentRoute === 'signup_email' ? 'signup_password' : null)
      );
    }
  };
  /**
   * If one of the email or password is empty in its specific login route,
   *  next step button will be disabled
   */
  const nextStepDisabled = () => {
    if (currentRoute === 'signup_email' && email.length === 0) {
      return true;
    } else if (currentRoute === 'signup_password' && password.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Container>
      {currentRoute === 'signup_email' ? (
        <AnimatedInput
          placeholder={'آدرس ایمیل'}
          error={emailError}
          type={'email'}
          value={email}
          onChange={(value) => dispatch(setEmailAction(value))}
        />
      ) : currentRoute === 'signup_password' ? (
        <Maintainer>
          <EnteredEmail
            editEmail={() => dispatch(loginRoute('signup_email'))}
          />
          <AnimatedInput
            placeholder={'رمزعبور'}
            error={passError}
            type={'password'}
            value={password}
            onChange={(value) => dispatch(setPasswordAction(value))}
          />
        </Maintainer>
      ) : null}
      <AcceptTerms />
      <LoadingButton
        label={'مرحله بعدی'}
        disable={nextStepDisabled()}
        onClick={() => nextStep()}
        isFetching={false}
      />
      <SignInMethods />
    </Container>
  );
};
export default Signup;

const Container = styled.div`
  display: flex;
  width: 90%;
  height: 80vh;
  border-radius: 13px;
  flex-direction: column;
  justify-content: space-around;
`;
const Maintainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;
